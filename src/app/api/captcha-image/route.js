// src/app/api/captcha-image/route.js
import { NextResponse } from 'next/server';
import { sealData, unsealData } from 'iron-session';
import * as fs from 'fs';
import path from 'path';

// Session configuration
const sessionOptions = {
  password: process.env.SESSION_SECRET || "complex-password-at-least-32-characters",
  cookieName: "captcha-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 15, 
    path: '/',
  },
};

export async function GET(request) {
  try {
    // Get session from cookies
    const cookie = request.cookies.get(sessionOptions.cookieName)?.value;
    const session = cookie ? await unsealData(cookie, sessionOptions) : {};

    // Initialize session if needed
    if (!session.attempts) {
      session.attempts = 0;
      session.selected = [];
      session.generatedImages = {};
    }

    // Validate index parameter
    const { searchParams } = new URL(request.url);
    const index = searchParams.get('index');
    
    if (index === null || isNaN(index)) {
      return NextResponse.json({ error: 'Invalid index' }, { status: 400 });
    }

    const numericIndex = parseInt(index);

    // Track which images we've shown (prevent cheating)
    if (!session.generatedImages[numericIndex]) {
      session.generatedImages[numericIndex] = true;
      session.attempts++;
    }

    // Determine image type (alternating pattern)
    const isDog = numericIndex % 2 === 0;
    const imageName = isDog ? `dog${(numericIndex % 3) + 1}.png` : `muffin${(numericIndex % 3) + 1}.png`;

    // Save updated session
    const newCookie = await sealData(session, sessionOptions);
    
    // Return image with updated session cookie
    const imagePath = path.join(process.cwd(), 'public', 'dogs-and-muffins', imageName);
    const imageBuffer = fs.readFileSync(imagePath);

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Set-Cookie': `${sessionOptions.cookieName}=${newCookie}; ${sessionOptions.cookieOptions.secure ? 'Secure; ' : ''}HttpOnly; Path=${sessionOptions.cookieOptions.path}; Max-Age=${sessionOptions.cookieOptions.maxAge}`
      }
    });

  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}