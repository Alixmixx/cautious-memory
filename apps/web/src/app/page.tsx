"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/button";
import { useAuth } from "@/contexts/auth-context";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";

export default function Web() {
  const [response, setResponse] = useState<{ message: string; timestamp: string } | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const testApiCall = async () => {
    setLoading(true);
    setError(undefined);
    
    try {
      const result = await fetch(`${API_HOST}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
      }
      
      const data = await result.json();
      setResponse(data);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to API");
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    setResponse(null);
    setError(undefined);
  };

  if (authLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>AI Application</h1>
        <div>
          {user ? (
            <>
              <span style={{ marginRight: "15px" }}>Welcome, {user.email}</span>
              <Button onClick={() => router.push('/app')} style={{ marginRight: "10px" }}>
                Dashboard
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => router.push('/auth/login')} style={{ marginRight: "10px" }}>
                Sign In
              </Button>
              <Button onClick={() => router.push('/auth/signup')}>
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h2>API Connection Test</h2>
        <p>Test the connection between Next.js (port 3000) and NestJS API (port 3001)</p>
        
        <div style={{ marginBottom: "20px" }}>
          <Button 
            onClick={testApiCall}
            disabled={loading}
            style={{ marginRight: "10px" }}
          >
            {loading ? "Testing..." : "Test API Connection"}
          </Button>
          
          {response && (
            <Button onClick={onReset}>Reset</Button>
          )}
        </div>

        {error && (
          <div style={{ 
            padding: "10px", 
            backgroundColor: "#ffebee", 
            border: "1px solid #f44336", 
            borderRadius: "4px",
            marginBottom: "20px"
          }}>
            <h3 style={{ color: "#f44336", margin: "0 0 10px 0" }}>Error</h3>
            <p style={{ margin: "0", color: "#f44336" }}>{error}</p>
          </div>
        )}
        
        {response && (
          <div style={{ 
            padding: "10px", 
            backgroundColor: "#e8f5e8", 
            border: "1px solid #4caf50", 
            borderRadius: "4px" 
          }}>
            <h3 style={{ color: "#4caf50", margin: "0 0 10px 0" }}>Success!</h3>
            <p style={{ margin: "5px 0", color: "#2e7d32" }}>
              <strong>Message:</strong> {response.message}
            </p>
            <p style={{ margin: "5px 0", color: "#2e7d32" }}>
              <strong>Timestamp:</strong> {response.timestamp}
            </p>
          </div>
        )}
      </div>

      {user && (
        <div style={{ marginTop: "40px", padding: "20px", backgroundColor: "#f0f0f0", borderRadius: "8px" }}>
          <h2>Authenticated Features</h2>
          <p>You are signed in and can access protected features:</p>
          <Button onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
}
