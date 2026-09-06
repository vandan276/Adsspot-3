/**
 * ADSSPOT END-TO-END REPAIR VERIFICATION SUITE
 * Tests all 8 core criteria against the live PostgreSQL database and running server.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

function makeRequest(method, endpoint, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch {
          parsed = data;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: parsed,
          setCookie: res.headers['set-cookie'],
        });
      });
    });

    req.on('error', (err) => reject(err));
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('================================================================');
  console.log('🚀 ADSSPOT AUTH, RBAC, MEDIA & PERSISTENCE VERIFICATION SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Super Admin Login & Session Cookie Creation
    // -------------------------------------------------------------------------
    console.log('1. Testing Super Admin Database Authentication & Session Cookie...');
    const adminLogin = await makeRequest('POST', '/api/auth/email', {
      action: 'login',
      email: 'admin@adsspot.in',
      password: 'adsspot123',
    });

    assert(adminLogin.status === 200, `Super Admin login HTTP 200 (Got ${adminLogin.status})`);
    assert(adminLogin.data.success === true, 'Response contains success: true');
    assert(adminLogin.data.user.role === 'super_admin', 'User role is super_admin');
    assert(adminLogin.data.destination === '/admin', 'Redirects to /admin panel');
    assert(adminLogin.setCookie && adminLogin.setCookie.length > 0, 'Set-Cookie header received with adsspot_session');

    const adminCookie = adminLogin.setCookie ? adminLogin.setCookie[0].split(';')[0] : '';
    const adminSessionToken = adminLogin.data.sessionToken;

    // -------------------------------------------------------------------------
    // TEST 2: Negative Authentication Test (No mock creation)
    // -------------------------------------------------------------------------
    console.log('\n2. Testing Negative Auth: Invalid password must fail with 401...');
    const badLogin = await makeRequest('POST', '/api/auth/email', {
      action: 'login',
      email: 'admin@adsspot.in',
      password: 'wrongpassword999',
    });
    assert(badLogin.status === 401, `Invalid login correctly rejected with 401 (Got ${badLogin.status})`);
    assert(badLogin.data.success === false, 'Bad login returns success: false');

    // -------------------------------------------------------------------------
    // TEST 3: User Session Hydration (/api/user/me)
    // -------------------------------------------------------------------------
    console.log('\n3. Testing Session Hydration from httpOnly Cookie (/api/user/me)...');
    const meRes = await makeRequest('GET', '/api/user/me', null, {
      Cookie: adminCookie,
    });
    assert(meRes.status === 200, `/api/user/me returned HTTP 200 (Got ${meRes.status})`);
    assert(meRes.data.user && meRes.data.user.email === 'admin@adsspot.in', 'Hydrated session matches logged in user email');
    assert(Array.isArray(meRes.data.permissions), 'Permissions array returned');

    // -------------------------------------------------------------------------
    // TEST 4: Dynamic Custom Role Creation (RBAC)
    // -------------------------------------------------------------------------
    console.log('\n4. Testing Dynamic Custom Role Creation & Database Persistence...');
    const testSlug = `sales_exec_${Date.now()}`;
    const createRoleRes = await makeRequest('POST', '/api/roles', {
      name: 'Senior Sales Executive',
      slug: testSlug,
      description: 'Field sales lead responsible for merchant conversions in South Mumbai',
      dashboard_type: 'sm',
      permissions: ['merchants.view', 'merchants.create', 'posts.create', 'media.upload'],
    }, {
      Cookie: adminCookie,
    });

    assert(createRoleRes.status === 200 || createRoleRes.status === 201, `Dynamic role created with HTTP ${createRoleRes.status} (Expected 200/201)`);
    assert(createRoleRes.data.success === true, 'Dynamic role creation successful');
    assert(createRoleRes.data.role.slug === testSlug, `Role slug saved correctly: ${testSlug}`);
    assert(createRoleRes.data.role.permissions.length === 4, 'Role has 4 permissions assigned in database');

    const dynamicRoleId = createRoleRes.data.role.id;

    // -------------------------------------------------------------------------
    // TEST 5: Role Listing & Verification (/api/roles)
    // -------------------------------------------------------------------------
    console.log('\n5. Testing Dynamic Roles List (/api/roles)...');
    const rolesListRes = await makeRequest('GET', '/api/roles');
    assert(rolesListRes.status === 200, `Roles list returned HTTP 200 (Got ${rolesListRes.status})`);
    const foundCreatedRole = (rolesListRes.data.roles || []).find((r) => r.slug === testSlug);
    assert(foundCreatedRole !== undefined, 'Created dynamic role is present in live database roles list');

    // -------------------------------------------------------------------------
    // TEST 6: File Upload & Media Storage Pipeline (/api/media/upload)
    // -------------------------------------------------------------------------
    console.log('\n6. Testing Multipart File Upload & Media Table Persistence...');
    // Create boundary and multipart payload
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    const fakeImageContent = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]); // PNG header
    const postBody = Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="test_storefront.png"\r\nContent-Type: image/png\r\n\r\n`),
      fakeImageContent,
      Buffer.from(`\r\n--${boundary}\r\nContent-Disposition: form-data; name="module"\r\n\r\nstores\r\n`),
      Buffer.from(`--${boundary}--\r\n`),
    ]);

    const uploadRes = await new Promise((resolve) => {
      const req = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/media/upload',
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': postBody.length,
          Cookie: adminCookie,
        },
      }, (res) => {
        let d = '';
        res.on('data', (c) => d += c);
        res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(d) }));
      });
      req.write(postBody);
      req.end();
    });

    assert(uploadRes.status === 200, `Media upload returned HTTP 200 (Got ${uploadRes.status})`);
    assert(uploadRes.data.success === true, 'Upload response success: true');
    assert(uploadRes.data.media && uploadRes.data.media.file_url, `Media persisted with URL: ${uploadRes.data.file_url}`);

    // -------------------------------------------------------------------------
    // TEST 7: Merchant Creation & Database Persistence (/api/merchants/onboard)
    // -------------------------------------------------------------------------
    console.log('\n7. Testing Merchant Onboarding & Database Persistence...');
    const testPhone = `+9198${Math.floor(10000000 + Math.random() * 90000000)}`;
    const merchantRes = await makeRequest('POST', '/api/merchants/onboard', {
      bizName: 'Royal Surat Silk & Sarees',
      ownerName: 'Harshil Mehta',
      phone: testPhone,
      categoryId: 'cat-clothing',
      address: 'Ring Road, Surat 395002',
      pincode: '395002',
      tier: 'elite',
    }, {
      Cookie: adminCookie,
    });

    assert(merchantRes.status === 200, `Merchant onboard HTTP 200 (Got ${merchantRes.status})`);
    assert(merchantRes.data.success === true, 'Merchant onboarding success: true');
    assert(merchantRes.data.business.tier === 'elite', 'Business tier set to elite');
    assert(merchantRes.data.user.role === 'merchant', 'User role upgraded to merchant in database');

    const createdBizId = merchantRes.data.business.id;

    // -------------------------------------------------------------------------
    // TEST 8: Post Publishing & Cross-User Feed Visibility (/api/posts)
    // -------------------------------------------------------------------------
    console.log('\n8. Testing Feed Post Publishing & Cross-User Visibility...');
    const postRes = await makeRequest('POST', '/api/posts', {
      business_id: createdBizId,
      caption: 'Exclusive Handloom Silk Saree Collection 2026 launched today!',
      image_url: uploadRes.data.file_url,
    }, {
      Cookie: adminCookie,
    });

    assert(postRes.status === 200, `Post create HTTP 200 (Got ${postRes.status})`);
    assert(postRes.data.success === true, 'Post created successfully');

    // Verify cross-user feed visibility
    const feedRes = await makeRequest('GET', '/api/posts');
    assert(feedRes.status === 200, `Feed GET returned HTTP 200 (Got ${feedRes.status})`);
    const foundFeedPost = (feedRes.data.posts || []).find((p) => p.business_id === createdBizId);
    assert(foundFeedPost !== undefined, 'Published post is visible in public /api/posts feed for all consumers');

    // -------------------------------------------------------------------------
    // CLEANUP
    // -------------------------------------------------------------------------
    console.log('\n9. Cleaning up temporary test role...');
    const delRole = await makeRequest('DELETE', `/api/roles/${dynamicRoleId}`, null, {
      Cookie: adminCookie,
    });
    assert(delRole.status === 200, 'Test dynamic role cleaned up successfully');

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  }

  console.log('\n================================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed === 0) {
    console.log('🎉 ALL REPAIR CRITERIA VERIFIED AND PASSING WITH 100% SUCCESS!\n');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();
