"use server"
import { NextResponse } from 'next/server';
import { sealData, unsealData } from 'iron-session';


const sessionOptions = {
    password: process.env.SESSION_SECRET,
    cookieName: "captcha-session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 15, // 15 minutes
      path: '/',
      sameSite: 'lax',
      httpOnly: true,
    },
  };
  
  // Handle GET requests (verification check)
  export async function GET(request) {
    try {
      const cookie = request.cookies.get(sessionOptions.cookieName)?.value;
      
      if (!cookie) {
        return NextResponse.json({ 
          verified: false,
          attempts: 0
        });
      }
  
      const session = await unsealData(cookie, sessionOptions);
      return NextResponse.json({ 
        verified: !!session.verified,
        attempts: session.attempts || 0
      });
      
    } catch (error) {
      console.error("GET verification error:", error);
      // Return default unverified state on error
      return NextResponse.json({ 
        verified: false,
        attempts: 0
      });
    }
  }

export async function POST(request) {
  try {
    // Parse incoming data
    const requestBody = await request.json();
    const { selections } = requestBody;
    
    if (!Array.isArray(selections)) {
      return NextResponse.json(
        { error: "Invalid selections format" },
        { status: 400 }
      );
    }

    // Get or create session
    const cookie = request.cookies.get(sessionOptions.cookieName)?.value;
    let session = cookie ? await unsealData(cookie, sessionOptions) : {};
    
    // Verification logic - ensure all selected indices are even (dogs)
    const isVerified = selections.length > 0 && 
                      selections.every(index => index % 2 === 0);
    
    // Update session
    session.verified = isVerified;
    session.attempts = (session.attempts || 0) + 1;
    session.lastAttempt = new Date().toISOString();
    
    // Create new sealed cookie
    const newCookie = await sealData(session, sessionOptions);
    
    // Response headers
    const responseHeaders = {
      'Set-Cookie': `${sessionOptions.cookieName}=${newCookie}; ${
        sessionOptions.cookieOptions.secure ? 'Secure; ' : ''
      }HttpOnly; Path=${sessionOptions.cookieOptions.path}; ${
        sessionOptions.cookieOptions.sameSite ? `SameSite=${sessionOptions.cookieOptions.sameSite}; ` : ''
      }Max-Age=${sessionOptions.cookieOptions.maxAge}`,
      'Cache-Control': 'no-store'
    };

    return NextResponse.json(
      { 
        verified: isVerified,
        attempts: session.attempts 
      },
      { headers: responseHeaders }
    );
    
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
}