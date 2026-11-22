import About from './About';
import Projects from './Projects';
import Contact from './Contact';
import Terminal from './Terminal';
import Trash from './Trash';

// Апп бүрийн бүртгэл: гарчиг, файлын нэр, цонхны анхны хэмжээ
export const APPS = [
  { id: 'about', title: 'Миний тухай', file: 'about.md', w: 700, h: 620, Component: About },
  { id: 'projects', title: 'Бүтээлүүд', file: '~/projects', w: 880, h: 640, Component: Projects },
  { id: 'contact', title: 'Холбоо барих', file: 'contact.txt', w: 600, h: 640, Component: Contact },
  { id: 'terminal', title: 'Терминал', file: 'zsh — 80×24', w: 680, h: 440, Component: Terminal },
  { id: 'trash', title: 'Хогийн сав', file: '~/.trash', w: 500, h: 420, Component: Trash },
];
