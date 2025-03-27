import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const index = searchParams.get('index');
  
  // Debug: Log the incoming request
  console.log(`Requested image index: ${index}`);

  // Validate index
  if (index === null || isNaN(index)) {
    return NextResponse.json({ error: 'Invalid index' }, { status: 400 });
  }

  // Determine image type
  const isDog = parseInt(index) % 2 === 0;
  const imageName = isDog ? 'dog1.png' : 'muffin1.png';
  const imagePath = path.join(process.cwd(), 'public', 'dogs-and-muffins', imageName);

  // Debug: Log the resolved path
  console.log(`Looking for image at: ${imagePath}`);

  try {
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      console.error('Image not found at path:', imagePath);
      return NextResponse.json({ error: 'Image file not found' }, { status: 404 });
    }

    const imageBuffer = fs.readFileSync(imagePath);
    
    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error loading image:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}