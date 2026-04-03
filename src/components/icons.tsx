import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
      <path d="m16.5 15.4-4-2.3" />
      <path d="m19 13-1.2-4.2a.5.5 0 0 0-.6-.3L13 10" />
      <path d="m20.5 18.9-4.4-2.5" />
      <path d="m14 19-1.2-4.2a.5.5 0 0 0-.6-.3L8 16" />
      <path d="m7.5 15.4-4-2.3" />
      <path d="m5 13-1.2-4.2a.5.5 0 0 0-.6-.3L-1 10" />
    </svg>
  ),
  college: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
};
