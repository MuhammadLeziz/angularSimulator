export interface INavLink {
  label: string;
  href: string;
}

export interface IAdvantage {
  icon: 'guide' | 'shield' | 'price';
  title: string;
  text: string;
}

export interface IDestination {
  image: string;
  title: string;
  subtitle: string;
  price: string;
  rating: string;
}

export interface IPost {
  image: string;
  title: string;
  excerpt: string;
  date: string;
  highlighted?: boolean;
}

export interface IGalleryItem {
  image: string;
  alt: string;
  wide?: boolean;
}

export interface IFooterColumn {
  title: string;
  links: string[];
}
