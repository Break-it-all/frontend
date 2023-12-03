"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Page() {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/test');
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Test Page</h1>
      <h2>{data ? JSON.stringify(data) : 'Loading data...'}</h2>
    </div>
  );
}