export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/+$/, "");
  }
  return "https://highbury.papoundhomelab.ddnsgeek.com";
}

export const siteConfig = {
  name: "Highbury International",
  titleDefault: "Highbury International | เสื้อเชิ้ตคุณภาพพรีเมียม สไตล์และสรีระคนเอเชีย",
  titleTemplate: "%s | Highbury International",
  description:
    "เสื้อเชิ้ตสำเร็จรูปคุณภาพสูง สำหรับผู้ชายและผู้หญิง คัตติ้งเนี้ยบ ทรง Asian Fit พอดีตัว ระบายอากาศดีเยี่ยม พร้อมรับผลิต-สั่งทำ OEM ตอบโจทย์ทุกองค์กร",
  keywords: [
    "เสื้อเชิ้ต",
    "เสื้อเชิ้ตผู้ชาย",
    "เสื้อเชิ้ตผู้หญิง",
    "เสื้อเชิ้ตแขนยาว",
    "เสื้อเชิ้ตแขนสั้น",
    "เสื้อเชิ้ตสามส่วน",
    "เสื้อเชิ้ตทำงาน",
    "เสื้อเชิ้ตสำเร็จรูป",
    "Highbury International",
    "Highbury",
    "เสื้อเชิ้ตผ้าคอตตอน",
    "เสื้อเชิ้ตทรงสวย",
    "รับผลิตเสื้อเชิ้ต",
    "ยูนิฟอร์มเสื้อเชิ้ต",
  ],
  phone: "086-311-6292",
  phoneIntl: "+66863116292",
  email: "thong_than@hotmail.com",
  lineUrl: "https://lin.ee/T8tlget",
  lineId: "@highbury",
  defaultOgImage: "/images/hero-main.jpg",
  locale: "th_TH",
  address: {
    addressLocality: "กรุงเทพมหานคร",
    addressCountry: "TH",
  },
};

export function generateOrganizationSchema() {
  const baseUrl = getBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: siteConfig.name,
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/images/logo/highbury-logo.png`,
      caption: siteConfig.name,
    },
    image: `${baseUrl}${siteConfig.defaultOgImage}`,
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.phoneIntl,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.address.addressLocality,
      addressCountry: siteConfig.address.addressCountry,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.phoneIntl,
        contactType: "customer service",
        areaServed: "TH",
        availableLanguage: ["Thai", "English"],
      },
    ],
    sameAs: [siteConfig.lineUrl],
  };
}

export function generateWebSiteSchema() {
  const baseUrl = getBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: {
      "@id": `${baseUrl}/#organization`,
    },
    inLanguage: "th-TH",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  const baseUrl = getBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
    })),
  };
}

export interface ProductSchemaInput {
  name: string;
  nameTh?: string | null;
  slug: string;
  description?: string | null;
  descTh?: string | null;
  images?: Array<{ url: string }> | string[];
  variants?: Array<{
    id?: string;
    sku: string;
    price: number;
    stock?: number;
    color?: string;
    size?: string;
  }>;
  categoryName?: string;
}

export function generateProductSchema(product: ProductSchemaInput) {
  const baseUrl = getBaseUrl();
  const canonicalUrl = `${baseUrl}/products/${product.slug}`;
  const title = product.nameTh || product.name;
  const description = product.descTh || product.description || siteConfig.description;

  const imageUrls: string[] = (product.images || [])
    .map((img) => {
      const url = typeof img === "string" ? img : img.url;
      return url.startsWith("http") ? url : `${baseUrl}${url}`;
    })
    .filter(Boolean);

  if (imageUrls.length === 0) {
    imageUrls.push(`${baseUrl}${siteConfig.defaultOgImage}`);
  }

  const prices = (product.variants || []).map((v) => v.price).filter((p) => typeof p === "number" && p > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 595;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : minPrice;
  const totalStock = (product.variants || []).reduce((acc, v) => acc + (v.stock ?? 0), 0);
  const isAvailable = product.variants && product.variants.length > 0 ? totalStock > 0 : true;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${canonicalUrl}#product`,
    name: title,
    description: description,
    image: imageUrls,
    sku: product.variants?.[0]?.sku || product.slug,
    brand: {
      "@type": "Brand",
      name: "Highbury",
    },
    category: product.categoryName || "เสื้อเชิ้ต",
    offers: {
      "@type": "AggregateOffer",
      url: canonicalUrl,
      priceCurrency: "THB",
      lowPrice: minPrice,
      highPrice: maxPrice,
      offerCount: product.variants?.length || 1,
      availability: isAvailable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: siteConfig.name,
      },
    },
  };
}

export interface ArticleSchemaInput {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  imageUrl?: string;
  authorName?: string;
}

export function generateArticleSchema(post: ArticleSchemaInput) {
  const baseUrl = getBaseUrl();
  const canonicalUrl = `${baseUrl}/blog/${post.slug}`;
  const image = post.imageUrl
    ? post.imageUrl.startsWith("http")
      ? post.imageUrl
      : `${baseUrl}${post.imageUrl}`
    : `${baseUrl}${siteConfig.defaultOgImage}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonicalUrl}#article`,
    headline: post.title,
    description: post.excerpt,
    image: [image],
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    author: {
      "@type": "Organization",
      name: post.authorName || siteConfig.name,
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/logo/highbury-logo.png`,
      },
    },
    inLanguage: "th-TH",
  };
}
