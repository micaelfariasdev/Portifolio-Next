import Image from "next/image";

export default function MfLogo() {
  return (
    <Image
      src="/img/logo-completa.svg"
      alt="Logo"
      width={250}
      height={150}
      style={{ height: "auto" }}
      className="w-130"
    />
  );
}
