export class Utils {
    public static readonly MAX_PLAYERS_TO_START: number = 2;
    public static readonly MAX_PLAYERS_TO_GET_WINNER_TEAM: number = 2;
    public static readonly MAX_VOTES_TO_ABORT_MATCH: number = 2;
}

export interface SocialMedia {
  id: number;
  name: string;
  baseUrl: string;
}


export const SOCIAL_MEDIA_LIST: SocialMedia[] = [
  { id: 1, name: 'Discord', baseUrl: 'https://discord.com/' },
  { id: 2, name: 'Instagram', baseUrl: 'https://instagram.com/' },
  { id: 3, name: 'Facebook', baseUrl: 'https://facebook.com/' },
  { id: 4, name: 'TikTok', baseUrl: 'https://tiktok.com/' },
  { id: 5, name: 'YouTube', baseUrl: 'https://youtube.com/' },
  { id: 6, name: 'Twitch', baseUrl: 'https://twitch.tv/' },
  { id: 7, name: 'Twitter', baseUrl: 'https://twitter.com/' },
];


export const SOCIAL_MEDIA_MAP = SOCIAL_MEDIA_LIST.reduce(
  (map, socialMedia) => {
    map[socialMedia.id] = socialMedia;
    return map;
  },
  {} as { [key: number]: SocialMedia }
);


