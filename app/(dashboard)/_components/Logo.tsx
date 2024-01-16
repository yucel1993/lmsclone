import Image from "next/image";

const Logo = () => {
  return (
    <Image
      src="/logo.png"
      alt="Logo"
      width={50}
      height={50}
      className="rounded-full"
    />
  );
};

export default Logo;
