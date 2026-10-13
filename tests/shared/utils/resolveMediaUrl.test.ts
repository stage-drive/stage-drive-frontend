import { resolveMediaUrl } from '@/shared/utils/resolveMediaUrl';

const avatarPath = '/uploads/avatars/6bb50522-55e6-46c0-b1da-0eb01cc0c2e1.jfif';

describe('resolveMediaUrl', () => {
  it('keeps a relative upload path when the API is on the same origin', () => {
    expect(resolveMediaUrl(avatarPath, '/api')).toBe(avatarPath);
  });

  it('loads a relative upload path from the remote API host', () => {
    expect(
      resolveMediaUrl(avatarPath, 'https://stage-drive-backend-test.example/api'),
    ).toBe(`https://stage-drive-backend-test.example${avatarPath}`);
  });

  it('leaves an absolute address unchanged', () => {
    const url = `https://cdn.example${avatarPath}`;
    expect(resolveMediaUrl(url, 'https://stage-drive-backend-test.example/api')).toBe(url);
  });
});
