#!/bin/bash

echo "=== JoinEazy Authentication Test Script ==="
echo "Testing authentication flow for IP: 192.168.31.50"
echo

# Test 1: Check if services are running
echo "1. Checking if services are running..."
curl -s -f http://192.168.31.50:3000 > /dev/null
if [ $? -eq 0 ]; then
    echo "✓ Frontend is accessible on port 3000"
else
    echo "✗ Frontend is not accessible on port 3000"
    exit 1
fi

curl -s -f http://192.168.31.50:8000/api/v1/auth/status > /dev/null 2>&1
if [ $? -eq 22 ]; then  # 22 means HTTP error (like 401), but server is responding
    echo "✓ Backend is accessible on port 8000"
else
    echo "✗ Backend is not accessible on port 8000"
    exit 1
fi

echo

# Test 2: Test login flow
echo "2. Testing login flow..."
echo "Attempting login with test credentials..."

# Login and save cookies
LOGIN_RESPONSE=$(curl -s -w "%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"student@mahindrauniversity.edu.in","password":"Student123!"}' \
    -c test_cookies.txt \
    http://192.168.31.50:8000/api/v1/auth/login)

HTTP_CODE="${LOGIN_RESPONSE: -3}"
if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ Login successful (HTTP 200)"
else
    echo "✗ Login failed (HTTP $HTTP_CODE)"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi

echo

# Test 3: Test authentication status with cookies
echo "3. Testing authentication status..."
STATUS_RESPONSE=$(curl -s -w "%{http_code}" \
    -b test_cookies.txt \
    http://192.168.31.50:8000/api/v1/auth/status)

HTTP_CODE="${STATUS_RESPONSE: -3}"
if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ Authentication status check successful (HTTP 200)"
    echo "User is properly authenticated"
else
    echo "✗ Authentication status check failed (HTTP $HTTP_CODE)"
    echo "Response: $STATUS_RESPONSE"
fi

echo

# Test 4: Test dashboard API with cookies
echo "4. Testing dashboard API..."
DASHBOARD_RESPONSE=$(curl -s -w "%{http_code}" \
    -b test_cookies.txt \
    http://192.168.31.50:8000/api/v1/user/dashboard-overview)

HTTP_CODE="${DASHBOARD_RESPONSE: -3}"
if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ Dashboard API successful (HTTP 200)"
    echo "Dashboard data is accessible"
else
    echo "✗ Dashboard API failed (HTTP $HTTP_CODE)"
    echo "Response: $DASHBOARD_RESPONSE"
fi

echo

# Test 5: Check cookie contents
echo "5. Cookie Analysis..."
if [ -f test_cookies.txt ]; then
    echo "Cookies saved to test_cookies.txt:"
    cat test_cookies.txt
    echo
    
    # Check for specific cookies
    if grep -q "accessToken" test_cookies.txt; then
        echo "✓ accessToken cookie found"
    else
        echo "✗ accessToken cookie not found"
    fi
    
    if grep -q "refreshToken" test_cookies.txt; then
        echo "✓ refreshToken cookie found"
    else
        echo "✗ refreshToken cookie not found"
    fi
else
    echo "✗ No cookies file found"
fi

echo

# Cleanup
rm -f test_cookies.txt

echo "=== Test Complete ==="
echo
echo "Next steps:"
echo "1. Open http://192.168.31.50:3000/login in your browser"
echo "2. Login with: student@mahindrauniversity.edu.in / Student123!"
echo "3. Check if you can access the dashboard successfully"
echo "4. Open browser developer tools to check for any console errors"
