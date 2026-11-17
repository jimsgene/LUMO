export const exhibitUrl = (id) => `${window.location.origin}/exhibits/${id}`;
export const openPalette = () => window.dispatchEvent(new Event('ism:palette'));
