import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import Logo from "@assets/Logo.svg";

/**
 * Button component for OAuth providers
 */
const OauthProviderButton = ({
  provider,
  icon,
  handleClick,
}: {
  icon: React.ReactNode;
  provider: string;
  handleClick: (...args: any[]) => any;
}) => {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full h-14 hover:bg-gray-100 hover:cursor-pointer"
      onClick={handleClick}
    >
      <span>{icon}</span>
      <span className="flex text-base">
        Login with&nbsp;
        <p className="font-bold">{provider.charAt(0).toUpperCase() + provider.slice(1)}</p>
      </span>
    </Button>
  );
};

/**
 * Google login button
 */
const GoogleButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_SERVER_ORIGIN}/auth/google`;
  };

  return (
    <OauthProviderButton
      provider="google"
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            fill="currentColor"
          />
        </svg>
      }
      handleClick={handleGoogleLogin}
    />
  );
};

/**
 * Apple login button
 */
const AppleButton = () => {
  const handleAppleLogin = () => {
    //TODO: handle login
  };

  return (
    <OauthProviderButton
      provider="apple"
      handleClick={handleAppleLogin}
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
            fill="currentColor"
          />
        </svg>
      }
    />
  );
};

const MetaButton = () => {
  const handleMetaLogin = () => {
    //TODO: handle login
  };

  return (
    <OauthProviderButton
      provider="meta"
      handleClick={handleMetaLogin}
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" width="45" height="29.813" viewBox="0 0 45 29.813">
          <path
            id="Icon_fa-brands-meta"
            data-name="Icon fa-brands-meta"
            d="M45,22.352c0,6.42-2.77,10.441-7.755,10.441-4.4,0-6.736-2.433-11.032-9.6,0,0-3.227-5.4-3.7-6.159-1.413,2.377-3.6,6.159-3.6,6.159-4.711,8.2-7.07,9.6-10.748,9.6C3.053,32.794,0,28.765,0,22.535,0,12.48,5.61,2.981,12.93,2.981c3.53,0,6,1.663,9.584,6.221,3.129-4.422,6.089-6.221,9.78-6.221C39.262,2.981,45,11.82,45,22.352ZM20.2,12.312c-3.016-4.366-4.976-4.458-7.332-4.458-4.352,0-8,7.46-8,14.766,0,3.41,1.3,5.323,3.486,5.323,2.123,0,3.445-1.336,7.256-7.3a87.555,87.555,0,0,0,4.59-8.332ZM37.35,27.942c2.264,0,3.3-1.934,3.3-5.266,0-8.733-3.8-14.822-8.64-14.822-2.334,0-4.319.795-6.7,4.458.661.97,1.343,2.039,4.7,7.58,4.127,6.616,5.168,8.051,7.341,8.051Z"
            transform="translate(0 -2.981)"
            fill="#1d1d1d"
          />
        </svg>
      }
    />
  );
};

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn(
      "",
      className
    )}
    {...props}
    >
      <div className="flex flex-col w-[450] h-fit bg-accent pb-3 rounded-xl border-1 border-accent">
        <Card className="w-full h-full pt-12 justify-between border-1 border-accent rounded-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-center flex flex-col space-y-10">
              <img src={Logo} alt="Flayva Logo" className="h-20 w-auto" />
              <span className="flex items-center justify-center text-nowrap">
                Sign in to&nbsp;<p className="font-black font-stretch-ultra-condensed">FLAYVA</p>
              </span>
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Welcome back! Please sign in to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 mt-10">
              <GoogleButton />
              <AppleButton />
              <MetaButton />
            </div>
          </CardContent>
        </Card>
        <div className=" mx-8 py-2 text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  mt-4">
          By clicking continue, you agree to our <a href="#">Terms of Service</a> and{" "}
          <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
}
