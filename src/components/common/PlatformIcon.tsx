import React from 'react';
import {
  MessageCircle,
  Instagram,
  Linkedin,
  Github,
  Twitter,
  Send,
  Disc,
  Mail,
  Globe,
  Youtube,
  Video,
  Share2,
  Phone,
} from 'lucide-react';

interface PlatformIconProps {
  iconKey: string;
  className?: string;
  size?: number;
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({ iconKey, className = 'w-5 h-5', size = 20 }) => {
  const key = iconKey.toLowerCase();

  switch (key) {
    case 'whatsapp':
    case 'phone':
      return <MessageCircle className={className} size={size} />;
    case 'instagram':
      return <Instagram className={className} size={size} />;
    case 'linkedin':
      return <Linkedin className={className} size={size} />;
    case 'github':
      return <Github className={className} size={size} />;
    case 'twitter':
    case 'x':
      return <Twitter className={className} size={size} />;
    case 'telegram':
      return <Send className={className} size={size} />;
    case 'discord':
      return <Disc className={className} size={size} />;
    case 'mail':
    case 'email':
      return <Mail className={className} size={size} />;
    case 'globe':
    case 'web':
      return <Globe className={className} size={size} />;
    case 'youtube':
      return <Youtube className={className} size={size} />;
    case 'tiktok':
      return <Video className={className} size={size} />;
    default:
      return <Share2 className={className} size={size} />;
  }
};
