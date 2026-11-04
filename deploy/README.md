# Live enquiry API routing

Observed on the live domain: GET /api/public/booking-settings returned 200 text/html (the frontend index), while POST /api/public/booking-request returned Nginx 405. The public API is not reaching Express. SMTP authentication alone cannot resolve this routing failure.

On the Ubuntu host:

1. Locate the domain's active HTTPS server block using `sudo nginx -T`. Do not share the full output if it contains private configuration. Back up that site's configuration before editing.
2. In the deployed application directory, ensure the full application (including server/, package.json and dependencies) and its private .env are deployed. Confirm the server's PORT; the example snippet uses 8002. Run `npm run smtp:verify` here as Windows and the server have separate environments.
3. Check `curl -i http://127.0.0.1:8002/api/public/booking-settings`. It must return JSON. If connection is refused, start the application's Node backend through its existing process manager using `npm start`. If no service is configured, create a dedicated service for this application with its actual working directory and service account. Do not restart unrelated Node processes. Check application logs for startup/database failures if it exits.
4. Add the location in nginx-api.conf inside the existing HTTPS server block for this domain. Adjust 8002 to match the backend. Keep proxy_pass without a trailing slash so /api/ remains in the upstream request. Preserve existing TLS/frontend configuration.
5. Run `sudo nginx -t`. Only if successful, run `sudo systemctl reload nginx`.
6. Check the public endpoints:

```bash
curl -i https://styleexpresslimousines.co.uk/api/public/booking-settings
curl -i -X POST https://styleexpresslimousines.co.uk/api/public/booking-request -H 'Content-Type: application/json' --data '{}'
```

Expected: settings returns 200 application/json; the empty enquiry returns 400 application/json with the required-fields validation message. The empty request does not send any email. Then submit a controlled enquiry via the website to check team and sender receipt delivery.

If the proxy change causes a regression, restore the backed-up site configuration, run `sudo nginx -t`, and reload Nginx only if validation succeeds.

Reference: https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass
