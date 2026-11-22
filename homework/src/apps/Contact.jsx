import { useState } from 'react';
import { owner } from '../data';
import { ArrowIcon } from '../components/Icons';

// Холбоо барих: том имэйл (дарвал хуулна), сошиал холбоосууд, захидлын форм
export default function Contact({ api }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const links = [
    { label: 'GitHub', href: owner.github },
    { label: 'LinkedIn', href: owner.linkedin },
    { label: 'Facebook', href: owner.facebook },
    { label: 'Instagram', href: owner.instagram },
  ].filter((l) => l.href); // хоосон холбоосыг харуулахгүй

  // Сервергүй тул mailto: ашиглан зочны имэйл програмыг нээнэ
  const send = (e) => {
    e.preventDefault();
    window.location.href = `mailto:${owner.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  };

  return (
    <div className="doc">
      <p className="label">03 — Холбоо барих</p>
      <h2 className="contact-big">
        Хамтдаа<br />
        <span className="accent">юм бүтээе.</span>
      </h2>

      <button className="email-big" onClick={api.copyEmail}>
        <span className="email-text">{owner.email}</span>
        <span className="email-hint">дарж хуулах</span>
      </button>

      <ul className="link-rows">
        {links.map((l, i) => (
          <li key={l.label}>
            <a href={l.href} target="_blank" rel="noreferrer">
              <span className="idx">{String(i + 1).padStart(2, '0')}</span>
              <span className="link-label">{l.label}</span>
              <span className="link-val">{l.href.replace(/^https?:\/\/(www\.)?/, '')}</span>
              <ArrowIcon />
            </a>
          </li>
        ))}
      </ul>

      <form className="contact-form" onSubmit={send}>
        <p className="label">Захидал</p>
        <input placeholder="Гарчиг" value={subject} onChange={(e) => setSubject(e.target.value)} required />
        <textarea placeholder="Сайн байна уу…" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} required />
        <button className="btn btn-accent" type="submit">
          Илгээх <ArrowIcon />
        </button>
      </form>
    </div>
  );
}
