import { useEffect } from 'react';

const AdBanner = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('Adsbygoogle error:', e);
    }
  }, []);

  return (
    <div>
      <p style={{ color: "white" }}>Ads</p>
      <ins class="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-8414862430105960"
        data-ad-slot="2228936492"
        data-ad-format="auto"
        data-full-width-responsive="true"
        ></ins>
    </div>
  );
};

export default AdBanner;
