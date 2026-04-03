const jwt = require('jsonwebtoken');
const { requireAuth } = require('../../../src/middleware/auth');

describe('requireAuth middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('returns 401 when Authorization header is missing', () => {
    requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when Authorization header does not start with Bearer', () => {
    req.headers.authorization = 'Basic sometoken';
    requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when token is invalid', () => {
    req.headers.authorization = 'Bearer not-a-real-token';
    requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when token is expired', () => {
    const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: -1 });
    req.headers.authorization = `Bearer ${token}`;
    requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when token is signed with the wrong secret', () => {
    const token = jwt.sign({ admin: true }, 'wrong-secret');
    req.headers.authorization = `Bearer ${token}`;
    requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next() and sets req.admin when token is valid', () => {
    const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: '1h' });
    req.headers.authorization = `Bearer ${token}`;
    requireAuth(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.admin).toMatchObject({ admin: true });
    expect(res.status).not.toHaveBeenCalled();
  });
});
