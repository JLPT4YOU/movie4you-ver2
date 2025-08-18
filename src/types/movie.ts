export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Country {
  id: string;
  name: string;
  slug: string;
}

export interface Episode {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}

export interface Server {
  server_name: string;
  server_data: Episode[];
}

export interface TMDBInfo {
  type: string;
  id: string;
  season?: number;
  vote_average: number;
  vote_count: number;
}

export interface IMDBInfo {
  id: string;
  vote_average: number;
  vote_count: number;
}

export interface BreadCrumb {
  name: string;
  slug?: string;
  isCurrent?: boolean;
  position: number;
}

export interface SEOOnPage {
  og_type: string;
  titleHead: string;
  descriptionHead: string;
  og_image: string[];
  updated_time: number;
  og_url: string;
  seoSchema: {
    '@context': string;
    '@type': string;
    name: string;
    dateModified: string;
    dateCreated: string;
    url: string;
    datePublished: string;
    image: string;
    director: string;
  };
}

export interface MovieDetail {
  _id: string;
  name: string;
  origin_name: string;
  content: string;
  type: string;
  status: string;
  thumb_url: string;
  poster_url: string;
  is_copyright: boolean;
  trailer_url: string;
  time: string;
  episode_current: string;
  episode_total: string;
  quality: string;
  lang: string;
  notify: string;
  showtimes: string;
  slug: string;
  year: number;
  view: number;
  actor: string[];
  director: string[];
  category: Category[];
  country: Country[];
  chieurap: boolean;
  sub_docquyen: boolean;
  episodes: Server[];
  tmdb?: TMDBInfo;
  imdb?: IMDBInfo;
  created: {
    time: string;
  };
  modified: {
    time: string;
  };
}

export interface Movie {
  _id: string;
  name: string;
  slug: string;
  thumb_url: string;
  poster_url: string;
  year: number;
  episode_current: string;
  episode_total?: string;
  quality: string;
  lang: string;
  time?: string;
  category?: Category[];
  country?: Country[];
  content?: string;
  status?: string;
  id?: string;
}

export interface MovieDetailResponse {
  status: string;
  message: string;
  data: {
    seoOnPage: SEOOnPage;
    breadCrumb: BreadCrumb[];
    params: {
      slug: string;
    };
    item: MovieDetail;
    APP_DOMAIN_CDN_IMAGE: string;
  };
}
