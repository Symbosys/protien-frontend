"use client";

import Link from "next/link";
import { useRouter, usePathname, useParams, useSearchParams } from "next/navigation";
import React from "react";

// custom Link component mapping 'to' prop to 'href'
export const RouterLink = React.forwardRef<HTMLAnchorElement, any>(
  ({ to, href, ...props }, ref) => {
    return <Link ref={ref} href={to || href || "#"} {...props} />;
  }
);
RouterLink.displayName = "RouterLink";

export { RouterLink as Link };

// custom NavLink mapping 'to' to 'href' and checking active pathname
export const NavLink = React.forwardRef<HTMLAnchorElement, any>(
  ({ to, className, style, end, ...props }, ref) => {
    const pathname = usePathname() || "";
    const isActive = end ? pathname === to : pathname.startsWith(to);

    let resolvedClass = className;
    if (typeof className === "function") {
      resolvedClass = className({ isActive });
    } else if (resolvedClass && isActive) {
      resolvedClass = `${resolvedClass} active`;
    }

    let resolvedStyle = style;
    if (typeof style === "function") {
      resolvedStyle = style({ isActive });
    }

    return (
      <Link ref={ref} href={to || "#"} className={resolvedClass} style={resolvedStyle} {...props} />
    );
  }
);
NavLink.displayName = "NavLink";

export const useNavigate = () => {
  const router = useRouter();
  return (to: string | number, options?: { replace?: boolean }) => {
    if (typeof to === "number") {
      if (to === -1) router.back();
      return;
    }
    if (options?.replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  };
};

export const useLocation = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return {
    pathname: pathname || "/",
    search: searchParams ? `?${searchParams.toString()}` : "",
    hash: "",
    state: null,
  };
};

// Next.js standard params hook behaves slightly differently.
export const useCustomParams = () => {
  const params = useParams();
  return params || {};
};
export { useCustomParams as useParams };

// Next.js useSearchParams returns a ReadonlyURLSearchParams.
// In React Router, useSearchParams returns [URLSearchParams, (newParams) => void].
export const useCustomSearchParams = (): [URLSearchParams, (nextInit: any) => void] => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const urlParams = React.useMemo(() => {
    return new URLSearchParams(searchParams?.toString() || "");
  }, [searchParams]);

  const setSearchParams = React.useCallback(
    (nextInit: any) => {
      const nextParams = typeof nextInit === "function" ? nextInit(urlParams) : nextInit;
      let searchStr = "";
      if (nextParams instanceof URLSearchParams) {
        searchStr = nextParams.toString();
      } else if (typeof nextParams === "object") {
        const temp = new URLSearchParams();
        Object.entries(nextParams).forEach(([k, v]) => {
          if (v !== null && v !== undefined) {
            temp.set(k, String(v));
          }
        });
        searchStr = temp.toString();
      } else {
        searchStr = String(nextParams);
      }
      router.push(`${pathname}?${searchStr}`);
    },
    [router, pathname, urlParams]
  );

  return [urlParams, setSearchParams];
};
export { useCustomSearchParams as useSearchParams };

// Dummy exports in case they are imported somewhere
export const BrowserRouter = ({ children }: any) => <>{children}</>;
export const Routes = ({ children }: any) => <>{children}</>;
export const Route = () => null;
