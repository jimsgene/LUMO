const parts = (d) => String(d).slice(0, 10).split('-').map(Number); // [y, m, d]

export const dateMn = (d) => {
  const [y, m, day] = parts(d);
  return `${y} оны ${m}-р сарын ${day}`;
};
export const monthMn = (d) => `${parts(d)[1]}-р сар`;
export const dayOf = (d) => parts(d)[2];
export const yearOf = (d) => (d ? parts(d)[0] : null);

export const statusMn = { pending: 'хүлээгдэж байна', approved: 'зөвшөөрсөн', rejected: 'татгалзсан' };

const ERR = {
  'Invalid login credentials': 'Имэйл эсвэл нууц үг буруу байна.',
  'User already registered': 'Энэ имэйл хаягаар бүртгүүлсэн байна.',
  'Email not confirmed': 'Имэйл хаягаа баталгаажуулна уу.',
};
export const errMn = (m) => ERR[m] || m;