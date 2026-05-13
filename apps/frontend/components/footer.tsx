import Link from "next/link"

const navigation = {
  main: [
    { name: "Films", href: "/films" },
    { name: "Collections", href: "/collections" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  secondary: [
    { name: "Screening Inquiries", href: "/contact" },
    { name: "Licensing", href: "/contact" },
    { name: "Press", href: "/contact" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Link href="/" className="text-lg font-medium tracking-tight text-foreground">
              Archive
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              A digital archive preserving and sharing a collection of moving image works.
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-foreground mb-4">Navigation</p>
            <ul className="space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <p className="text-sm font-medium text-foreground mb-4">Inquiries</p>
            <ul className="space-y-3">
              {navigation.secondary.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            All works displayed are copyrighted and may not be reproduced without permission.
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  )
}
