import { Helmet } from 'react-helmet-async';

interface SocialMediaMetaProps {
  title: string;
  description: string;
  image: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  siteName?: string;
  twitterHandle?: string;
}

export const SocialMediaMeta = ({
  title,
  description,
  image,
  url = window.location.href,
  type = 'website',
  siteName = 'ODE Food Hall Ubud',
  twitterHandle = '@ode_food_hall'
}: SocialMediaMetaProps) => {
  // Убеждаемся, что изображение имеет полный URL
  const fullImageUrl = image.startsWith('http') 
    ? image 
    : `${window.location.origin}${image}`;

  return (
    <Helmet>
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="ru_RU" />
      <meta property="og:locale:alternate" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      
      {/* LinkedIn */}
      <meta property="article:author" content="ODE Food Hall" />
      <meta property="article:publisher" content="https://ode-food-hall.lovable.app" />
      
      {/* WhatsApp */}
      <meta property="og:image:type" content="image/jpeg" />
      
      {/* Telegram */}
      <meta name="telegram:channel" content="@ode_food_hall" />
    </Helmet>
  );
};