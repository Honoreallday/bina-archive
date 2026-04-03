jest.mock('@aws-sdk/cloudfront-signer', () => ({
  getSignedUrl: jest.fn().mockReturnValue('https://test.cloudfront.net/hls/film.m3u8?sig=mocked'),
}));

const { getSignedUrl } = require('@aws-sdk/cloudfront-signer');
const { signUrl } = require('../../../src/lib/cloudfront');

describe('signUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls getSignedUrl with the correct URL and key pair ID', () => {
    const url = 'https://test.cloudfront.net/hls/film/film.m3u8';
    signUrl(url);

    expect(getSignedUrl).toHaveBeenCalledWith(
      expect.objectContaining({
        url,
        keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
      })
    );
  });

  it('sets expiry approximately 2 hours in the future', () => {
    signUrl('https://test.cloudfront.net/hls/film/film.m3u8');

    const { dateLessThan } = getSignedUrl.mock.calls[0][0];
    const expiry = new Date(dateLessThan);
    const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000);

    // Allow 5 second tolerance for test execution time
    expect(Math.abs(expiry - twoHoursFromNow)).toBeLessThan(5000);
  });

  it('returns the signed URL from the AWS signer', () => {
    const result = signUrl('https://test.cloudfront.net/hls/film/film.m3u8');
    expect(result).toBe('https://test.cloudfront.net/hls/film.m3u8?sig=mocked');
  });
});
