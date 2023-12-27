import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Stomp, CompatClient } from "@stomp/stompjs";
import { FaMicrophone } from "react-icons/fa";

interface Props {
  id: number | undefined;
  name: string;
}

export default function VoiceChat({ id, name }: Props) {
  const [myKey, setMyKey] = useState(
    Math.random().toString(36).substring(2, 11)
  );
  const [otherKey, setOtherKey] = useState<string>();
  const [otherName, setOtherName] = useState<string>();

  const [localStream, setLocalStream] = useState<MediaStream>();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const stompClientRef = useRef<CompatClient | null>(null);
  let pcListMap = new Map<string, RTCPeerConnection>();
  const [isVoiceChatting, setIsVoiceChatting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {}, [otherKey, remoteVideoRef, pcListMap]);

  const handleEnterRoom = async () => {
    setIsConnected(true);

    await startLocalVideo();
    await connectWebSocket();
  };

  const handleStartStream = async () => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      await stompClientRef.current.send(
        `/app/call/key`,
        {},
        JSON.stringify({ myKey, name })
      );
      setIsVoiceChatting(true);
    } else {
      console.log("STREAM NOT CONNECTED !!!");
    }
  };

  const handleEndVoiceChat = async () => {
    console.log(otherKey);
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.send(`/app/disconnect/${otherKey}/${id}`, {});

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }

      stompClientRef.current.disconnect();

      setOtherKey(undefined);
      setOtherName(undefined);
      pcListMap.clear();

      setIsVoiceChatting(false);
      setIsConnected(false);
    }
  };

  const startLocalVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setLocalStream(stream);
      stream.getAudioTracks()[0].enabled = true;
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const connectWebSocket = async () => {
    console.log("START TO CONNECT WEBSOCKET");
    const socket = new SockJS("http://localhost:8080/signaling");
    stompClientRef.current = Stomp.over(socket);

    stompClientRef.current.connect({}, function () {
      console.log("CONNECT TO WEBRTC SERVER");
      stompClientRef.current?.subscribe(
        `/topic/peer/iceCandidate/${myKey}/${id}`,
        (candidate) => {
          const key = JSON.parse(candidate.body).key;
          const message = JSON.parse(candidate.body).body;

          console.log("SUB ICECANDIDATE", message);
          pcListMap.get(key)?.addIceCandidate(
            new RTCIceCandidate({
              candidate: message.candidate,
              sdpMLineIndex: message.sdpMLineIndex,
              sdpMid: message.sdpMid,
            })
          );
        }
      );

      stompClientRef.current?.subscribe(
        `/topic/peer/offer/${myKey}/${id}`,
        (offer) => {
          const key = JSON.parse(offer.body).key;
          const message = JSON.parse(offer.body).body;

          pcListMap.set(key, createPeerConnection(key));
          console.log(
            "[connectWebSocket] : RTCPeerConnection State:",
            pcListMap.get(key)!.connectionState
          );

          if (pcListMap.has(key)) {
            pcListMap
              .get(key)!
              .setRemoteDescription(
                new RTCSessionDescription({
                  type: message.type,
                  sdp: message.sdp,
                })
              )
              .then(() => sendAnswer(pcListMap.get(key)!, key))
              .catch((error) => {
                console.error("Error setting remote description:", error);
              });
          }
        }
      );

      stompClientRef.current?.subscribe(
        `/topic/peer/answer/${myKey}/${id}`,
        async (answer) => {
          const key = JSON.parse(answer.body).key;
          const message = JSON.parse(answer.body).body;

          const peerConnection = pcListMap.get(key);

          if (peerConnection) {
            console.log(
              "[subscribe answer] : RTCPeerConnection State:",
              peerConnection.connectionState
            );

            if (peerConnection.connectionState === "new") {
              await new Promise<void>((resolve) => {
                const checkState = () => {
                  if (peerConnection.connectionState.toString() === "stable") {
                    resolve();
                  } else {
                    setTimeout(checkState, 100); // Check again after a short delay
                  }
                };
                checkState();
              });
            }

            try {
              await peerConnection.setRemoteDescription(
                new RTCSessionDescription(message)
              );
              const answer = await peerConnection.createAnswer();
              await peerConnection.setLocalDescription(answer);
            } catch (error) {
              console.error("Error setting remote description:", error);
            }
          } else {
            console.warn("RTCPeerConnection not found for key:", key);
          }
        }
      );

      stompClientRef.current?.subscribe(
        `/topic/disconnect/${myKey}/${id}`,
        () => {
          setOtherKey(undefined);
          setOtherName(undefined);
          pcListMap.clear();
        }
      );

      stompClientRef.current?.subscribe(`/topic/call/key`, () => {
        stompClientRef.current?.send(
          `/app/send/key`,
          {},
          JSON.stringify({ myKey, name })
        );
      });

      stompClientRef.current?.subscribe(`/topic/send/key`, (message) => {
        const body = JSON.parse(message.body);
        console.log("BODY: ", body);
        const key = body.myKey;

        if (myKey !== key && !pcListMap.has(key)) {
          setOtherName(body.name);
          setOtherKey(key);
          console.log("SET OTHER KEY!!! ", key);
          pcListMap.set(key, createPeerConnection(key));
          sendOffer(pcListMap.get(key)!, key);
        }
      });
    });
  };

  const OnTrack = (event: RTCTrackEvent, otherKey: string) => {
    console.log("** ONTRACK!!");
    if (remoteVideoRef.current)
      remoteVideoRef.current.srcObject = event.streams[0];
  };

  const createPeerConnection = (otherKey: string) => {
    const pc = new RTCPeerConnection();
    pc.addEventListener("icecandidate", (event) => {
      console.log("*** ICECANDIDATE EVENT!!!");
      OnIceCandidate(event, otherKey);
    });
    pc.addEventListener("track", (event) => {
      OnTrack(event, otherKey);
    });
    if (localStream !== undefined) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }
    return pc;
  };

  const OnIceCandidate = (
    event: RTCPeerConnectionIceEvent,
    otherKey: string
  ) => {
    if (event.candidate) {
      console.log("SEND ICECANDIDATE!!");
      stompClientRef.current?.send(
        `/app/peer/iceCandidate/${otherKey}/${id}`,
        {},
        JSON.stringify({
          key: myKey,
          body: {
            candidate: event.candidate.candidate,
            sdpMLineIndex: event.candidate.sdpMLineIndex,
            sdpMid: event.candidate.sdpMid,
          },
        })
      );
    }
  };

  const sendOffer = async (pc: RTCPeerConnection, otherKey: string) => {
    const offer = await pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
      iceRestart: true,
    });

    await setLocalAndSendMessage(pc, offer);

    stompClientRef.current?.send(
      `/app/peer/offer/${otherKey}/${id}`,
      {},
      JSON.stringify({
        key: myKey,
        body: {
          type: offer.type,
          sdp: offer.sdp,
        },
      })
    );
  };

  const sendAnswer = async (pc: RTCPeerConnection, otherKey: string) => {
    const answer = await pc.createAnswer();
    await setLocalAndSendMessage(pc, answer);
    stompClientRef.current?.send(
      `/app/peer/answer/${otherKey}/${id}`,
      {},
      JSON.stringify({
        key: myKey,
        body: {
          type: answer.type,
          sdp: answer.sdp,
        },
      })
    );
  };

  const setLocalAndSendMessage = (
    pc: RTCPeerConnection,
    sessionDescription: RTCLocalSessionDescriptionInit
  ) => {
    console.log(
      "[setLocalAndSendMessage] : RTCPeerConnection State:",
      pc.connectionState
    );
    pc.setLocalDescription(sessionDescription);
  };

  return (
    <div className="bg-black text-white p-4 rounded-lg flex flex-col">
      <div className="flex justify-between items-center">
        <p className="font-bold">VOICE CHAT</p>
        <div className="flex gap-2">
          <div
            onClick={handleEnterRoom}
            className="flex justify-center items-center cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
          >
            <img
              src={"/assets/discord.svg"}
              alt={"교체"}
              className="w-4 h-4 mr-1 ml-2"
            />
          </div>
          <div
            onClick={isVoiceChatting ? handleEndVoiceChat : handleStartStream}
            className={`${
              isVoiceChatting ? "bg-red-500" : "bg-green-500"
            } hover:bg-red-700  font-bold py-1 px-3 rounded flex cursor-pointer justify-center items-center`}
          >
            {isVoiceChatting ? (
              <img
                src={"/assets/box-arrow-right.svg"}
                alt={"퇴장"}
                className="w-4 h-4 mr-1 ml-2"
              />
            ) : (
              <img
                src={"/assets/box-arrow-in-right.svg"}
                alt={"입장"}
                className="w-4 h-4 mr-1 ml-2"
              />
            )}
          </div>
        </div>
      </div>

      {isConnected && (
        <div className="mt-3 w-full">
          <div className="flex flex-col gap-1">
            <div>
              <div className="flex items-center">
                <FaMicrophone className="text-2xl mr-1 size-4" />
                <p>{name}</p>
              </div>
              <video
                ref={localVideoRef}
                controls
                className="flex-grow w-full h-0"
              />
            </div>
            {otherKey && (
              <div>
                <div className="flex items-center">
                  <FaMicrophone className="text-2xl mr-1 size-4" />
                  <p>{otherName}</p>
                </div>
                <video
                  ref={remoteVideoRef}
                  controls
                  className="flex-grow w-full h-0"
                  autoPlay
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
