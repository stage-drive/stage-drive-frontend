import { Flex, Image, theme } from 'antd';
import { resolveMediaUrl } from '@/shared/utils/resolveMediaUrl';

interface OrganizationLogoProps {
  logoUrl?: string | null;
  name?: string;
  size?: number;
}

export const OrganizationLogo = ({ logoUrl, name, size = 48 }: OrganizationLogoProps) => {
  const { token } = theme.useToken();
  const src = resolveMediaUrl(logoUrl);
  if (!src) return null;
  const onDarkSurface = token.colorBgLayout !== '#f8f9fb';

  return (
    <Flex
      align="center"
      justify="center"
      style={{
        width: size,
        height: size,
        flex: 'none',
        borderRadius: onDarkSurface ? token.borderRadiusLG : undefined,
        background: onDarkSurface ? token.colorFillSecondary : undefined,
        overflow: 'hidden',
      }}
    >
      <Image
        src={src}
        alt={name ? `Логотип ${name}` : 'Логотип автошколи'}
        preview={false}
        styles={{ root: { width: '100%', height: '100%', lineHeight: 0 } }}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </Flex>
  );
};
