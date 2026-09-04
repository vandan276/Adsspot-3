import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) {
      return NextResponse.json({ error: 'lat and lng required' }, { status: 400 });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    // Call OpenStreetMap Nominatim reverse geocoder
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Adsspot-Hyperlocal-App/1.0 (contact@adsspotindia.com)',
        'Accept': 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const area = addr.suburb || addr.neighbourhood || addr.residential || addr.road || addr.village || 'Hyperlocal Area';
      const city = addr.city || addr.town || addr.municipality || addr.state_district || 'Vadodara';
      const pincode = addr.postcode || '390007';
      const state = addr.state || 'Gujarat';

      return NextResponse.json({
        success: true,
        location: {
          area,
          city,
          pincode,
          state,
          lat: latitude,
          lng: longitude,
          formatted: `${area}, ${city}`,
        },
      });
    }

    // Fallback if nominatim is unavailable
    return NextResponse.json({
      success: true,
      location: {
        area: 'Detected Area',
        city: 'Current City',
        pincode: '390001',
        state: 'India',
        lat: latitude,
        lng: longitude,
        formatted: `Detected Area, City`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Geocoding failed' }, { status: 500 });
  }
}
