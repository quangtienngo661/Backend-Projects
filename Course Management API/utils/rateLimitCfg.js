const rateLimit = require('express-rate-limit');

const { failure } = require('./response');

/**
 * Rate Limiter Configuration
 * Giới hạn số request từ mỗi IP address để bảo vệ API khỏi abuse và DoS attacks
 */
const limiter = rateLimit({
    /**
     * windowMs: Thời gian cửa sổ tính toán (milliseconds)
     * 15 * 60 * 1000 = 15 phút
     * Sau mỗi 15 phút, counter sẽ reset về 0
     */
    windowMs: 15 * 60 * 1000,

    /**
     * limit: Số request tối đa mỗi IP được phép trong windowMs
     * 100 requests / 15 minutes = ~6.7 requests/minute
     * Đủ cho usage bình thường, chặn spam/bot
     */
    limit: 100,

    /**
     * handler: Function xử lý khi vượt quá limit
     * Sử dụng failure() utility để giữ response format nhất quán
     * Thay vì default HTML response của express-rate-limit
     */
    handler: (req, res) => {
        return failure(res, {
            message: "Too many requests from this IP, please try again later.",
            code: 429
        }, 429);
    },

    /**
     * standardHeaders: true
     * Thêm headers chuẩn RFC:
     * - RateLimit-Limit: Giới hạn tối đa
     * - RateLimit-Remaining: Số request còn lại
     * - RateLimit-Reset: Thời gian reset (Unix timestamp)
     */
    standardHeaders: true,

    /**
     * legacyHeaders: false  
     * Tắt legacy headers (X-RateLimit-*) để tránh trùng lặp
     * Chỉ dùng standardHeaders cho clean response
     */
    legacyHeaders: false,

    /**
     * skipSuccessfulRequests: false (default)
     * Count cả successful requests (2xx status codes)
     * Nếu true: chỉ count failed requests (4xx, 5xx)
     */
    skipSuccessfulRequests: false,

    /**
     * skipFailedRequests: false (default)  
     * Count cả failed requests (4xx, 5xx status codes)
     * Nếu true: chỉ count successful requests (2xx)
     */
    skipFailedRequests: false,

    /**
     * keyGenerator: function tạo key để identify client
     * Default: req.ip (IP address)
     * Có thể customize: req.user.id, req.headers['x-api-key'], etc.
     */
    // keyGenerator: (req) => req.ip, // Default behavior

    /**
     * store: Nơi lưu trữ rate limit data
     * Default: MemoryStore (in-memory, mất khi restart)
     * Production: Redis, MongoDB để persist và scale
     */
    // store: new RedisStore({...}), // For production with Redis
});

/**
 * Export limiter để sử dụng trong app.js
 * Apply globally hoặc cho specific routes
 */

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    handler: (req, res) => {
        return failure(res, {
            message: "Too many login attemps, please try again later.",
            code: 429
        }, 429);
    }, 
    standardHeaders: true, 
    legacyHeaders: false
});
module.exports = { limiter, loginLimiter };