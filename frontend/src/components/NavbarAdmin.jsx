const NavbarAdmin = () => {
  return (
    <nav className="bg-custom-blue2 p-4 shadow-md">
      <div className="container mx-auto flex flex-row-reverse justify-between items-center">
        {/* Logo déplacé à l'autre côté */}
        <a href="/admin/dashboard">
          <img src="/images/Logo.png" alt="Logo" className="h-6 w-auto" />
        </a>
        {/* Your Name */}
        <span className="hidden lg:block text-white text-xl font-bold">
   Allouach Amine
</span>
      </div>
    </nav>
  );
};

export default NavbarAdmin;
