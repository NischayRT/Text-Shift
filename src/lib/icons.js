// src/lib/icons.js
import { 
  FaLinkedin, FaReddit, FaInstagram, FaTwitter, 
  FaEnvelope, FaPenNib, FaBriefcase, FaWhatsapp, FaQuora,
} from "react-icons/fa6";
import { SiGmail } from "react-icons/si";
import { 
  LuBookOpen, LuLightbulb, LuMessageSquare, LuWand 
} from "react-icons/lu";

export const getToneIcon = (key) => {
  const icons = {
    linkedin: <FaLinkedin />,
    reddit: <FaReddit />,
    instagram: <FaInstagram />,
    twitter: <FaTwitter />,
    email: <FaEnvelope />,
    blog: <FaPenNib />,
    professional: <FaBriefcase />,
    story: <LuBookOpen />,
    advice: <LuLightbulb />,
    general: <LuMessageSquare />, 
    whatsapp: <FaWhatsapp />,
    gmail: <SiGmail />,
    quora: <FaQuora />,
  };
  
  // Replaced LuWand2 with LuWand here
  return icons[key] || <LuWand />;
};