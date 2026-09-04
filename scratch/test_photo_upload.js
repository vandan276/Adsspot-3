const http = require('http');

function postMultipart(path, fields, fileField, cookie = '') {
  return new Promise((resolve, reject) => {
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    let body = '';

    for (const [key, value] of Object.entries(fields)) {
      body += `--${boundary}\r\n`;
      body += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
      body += `${value}\r\n`;
    }

    if (fileField) {
      body += `--${boundary}\r\n`;
      body += `Content-Disposition: form-data; name="${fileField.name}"; filename="${fileField.filename}"\r\n`;
      body += `Content-Type: ${fileField.contentType}\r\n\r\n`;
      body += `${fileField.content}\r\n`;
    }

    body += `--${boundary}--\r\n`;

    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path,
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': Buffer.byteLength(body),
          Cookie: cookie,
        },
      },
      (res) => {
        let responseBody = '';
        res.on('data', (chunk) => (responseBody += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(responseBody);
          } catch (e) {
            parsed = responseBody;
          }
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsed,
          });
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function postJson(path, body, cookie = '') {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
          Cookie: cookie,
        },
      },
      (res) => {
        let responseBody = '';
        res.on('data', (chunk) => (responseBody += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(responseBody);
          } catch (e) {
            parsed = responseBody;
          }
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsed,
            cookies: res.headers['set-cookie'],
          });
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function test() {
  console.log('====================================================');
  console.log('📸 VERIFYING PHOTO UPLOAD, STORY & POST PERSISTENCE');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
    }
  }

  try {
    // 1. Sign up a new merchant & subscribe to Elite tier
    const testEmail = `nikunj_merchant_${Date.now()}@adsspot.in`;
    const testPassword = 'Password@123';
    const testName = 'Nikunj Jewelers';
    const testPhone = `+9198${Math.floor(10000000 + Math.random() * 90000000)}`;

    console.log(`1. Authenticating as Merchant (${testEmail})...`);
    const signupRes = await postJson('/api/auth/email', {
      action: 'signup',
      email: testEmail,
      password: testPassword,
      name: testName,
      phone: testPhone,
      role: 'merchant',
    });

    assert(signupRes.status === 200 && signupRes.data.success, 'Merchant user created');
    const sessionCookie = signupRes.cookies ? signupRes.cookies[0].split(';')[0] : '';
    const userId = signupRes.data.user.id;

    // 2. Subscribe to Elite Tier
    console.log('\n2. Activating Elite Tier Membership...');
    const subRes = await postJson(
      '/api/merchants/subscribe',
      {
        tier: 'elite',
        billingCycle: 'monthly',
        bizName: testName,
        ownerName: testName,
        phone: testPhone,
        categoryId: 'cat-7',
        address: 'Fort, Mumbai',
        pincode: '400001',
        paymentMethod: 'UPI',
        paymentId: `pay_test_${Date.now()}`,
        amount: 4999,
      },
      sessionCookie
    );

    assert(subRes.status === 200 && subRes.data.success, 'Elite membership activated');
    const businessId = subRes.data.business.id;

    // 3. Test Story Photo Upload via multipart form data with session cookie
    console.log('\n3. Testing Photo Upload (/api/media/upload) with session cookie...');
    const dummyImageContent = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const uploadRes = await postMultipart(
      '/api/media/upload',
      {
        module: 'stories',
        user_id: userId,
        merchant_id: businessId,
        visibility: 'public',
      },
      {
        name: 'file',
        filename: 'kundan_necklace.png',
        contentType: 'image/png',
        content: Buffer.from(dummyImageContent, 'base64').toString('binary'),
      },
      sessionCookie
    );

    console.log('   Upload status:', uploadRes.status);
    console.log('   Upload response:', JSON.stringify(uploadRes.data, null, 2));

    assert(uploadRes.status === 200 && uploadRes.data.success, 'Photo upload succeeded without Unauthorized error');
    assert(typeof uploadRes.data.file_url === 'string' && uploadRes.data.file_url.length > 0, 'file_url generated and returned');

    const uploadedPhotoUrl = uploadRes.data.file_url;

    // 4. Test Publishing 24h Story with uploaded photo URL
    console.log('\n4. Publishing 24-Hour Story with uploaded photo...');
    const storyRes = await postJson(
      '/api/stories',
      {
        business_id: businessId,
        media_url: uploadedPhotoUrl,
        caption: 'Special 20% discount on making charges today only!',
        tag: '20% OFF',
        coupon_code: 'FESTIVE20',
      },
      sessionCookie
    );

    console.log('   Story status:', storyRes.status);
    console.log('   Story response:', JSON.stringify(storyRes.data, null, 2));

    assert(storyRes.status === 200 && storyRes.data.success, 'Story published successfully');
    assert(storyRes.data.story && storyRes.data.story.business_id === businessId, 'Story linked to merchant business');

    // 5. Test Post Photo Upload and Feed Post creation
    console.log('\n5. Testing Post Image Upload and Publishing Feed Post...');
    const postUploadRes = await postMultipart(
      '/api/media/upload',
      {
        module: 'posts',
        user_id: userId,
        merchant_id: businessId,
        visibility: 'public',
      },
      {
        name: 'file',
        filename: 'bridal_collection_festive.png',
        contentType: 'image/png',
        content: Buffer.from(dummyImageContent, 'base64').toString('binary'),
      },
      sessionCookie
    );

    assert(postUploadRes.status === 200 && postUploadRes.data.success, 'Post photo upload succeeded');
    const postPhotoUrl = postUploadRes.data.file_url;

    const postRes = await postJson(
      '/api/posts',
      {
        business_id: businessId,
        caption: 'New Festive Kundan & Polki Collection now available in store!',
        image_url: postPhotoUrl,
      },
      sessionCookie
    );

    assert(postRes.status === 200 && postRes.data.success, 'Feed post published successfully');

    console.log('\n====================================================');
    console.log(`🏁 TEST RESULTS: ${passed}/${total} assertions passed (${Math.round((passed / total) * 100)}%)`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('Fatal test error:', err);
  }
}

test();
