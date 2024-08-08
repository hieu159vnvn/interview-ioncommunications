// pages/index.tsx
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; 


const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
      router.push('/admin');
  }, [router]);

  return null; // Không cần nội dung cho trang chính này
};

export default HomePage;
