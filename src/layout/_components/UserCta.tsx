"use client";

import Link from "next/link";
import {
  ArrowLeftEndOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { ModalRef, Modal } from "@/components/modal";
import ConfirmModal from "@/components/modal/Confirm";
import {
  MyPopup,
  MyPopupContent,
  MyPopupTrigger,
  PopupWrapper,
  TriggerRef,
  VerticalMenu,
} from "@/components/popup";
import { MyImage } from "@/components";
import { HeartIcon } from "@heroicons/react/16/solid";
// import { setLocalStorage } from "@/utils/appHelper";
import { moonIcon, sunIcon } from "../../../public/icon";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export default function UserCta() {
  const { data: session } = useSession();
  const { setTheme, theme } = useTheme();

  const [isMount, setIsMount] = useState(false);

  const modalRef = useRef<ModalRef>(null);
  const triggerRef = useRef<TriggerRef>(null);

  const router = useRouter();

  // const toggleDarkMode = (toggle: boolean) => {
  //   if (toggle) {
  //     document.documentElement.classList.add("dark");
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //   }

  //   setLocalStorage("dark", toggle);
  // };

  const handleNavigate = (path: string) => {
    triggerRef.current?.close();
    router.push(path);
  };

  useEffect(() => {
    if (!isMount) setIsMount(true);
  }, []);

  if (!isMount)
    return (
      <MyImage
        className="rounded-full"
        src={session?.user ? "/meo_vo_tri.png" : "/cho_vo_tri.jpg"}
        height={40}
        width={40}
      />
    );
  return (
    <>
      <MyPopup>
        <MyPopupTrigger ref={triggerRef} className="flex items-center">
          <button className="flex hover:brightness-90">
            <MyImage
              className="rounded-full"
              src={session?.user ? "/meo_vo_tri.png" : "/cho_vo_tri.jpg"}
              height={40}
              width={40}
            />
          </button>
        </MyPopupTrigger>

        <MyPopupContent
          className="top-[calc(100%+8px)] right-0"
          animationClassName="origin-top-right"
        >
          <PopupWrapper className="w-[200px] px-3">
            <div className="flex items-center p-[10px] pb-0">
              <MyImage
                className="rounded-full"
                src={session?.user ? "/meo_vo_tri.png" : "/cho_vo_tri.jpg"}
                height={50}
                width={50}
              />

              <div className="ml-[12px]">
                <h5 className="font-semibold line-clamp-1">
                  {session ? session.user.username : "Sign in"}
                </h5>
              </div>
            </div>

            <div className="mt-3 mb-2 bg-[--a-5-cl] h-0.5"></div>

            <VerticalMenu dismiss={false} className="[&_button]:rounded-md">
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="hover:text-red-500"
              >
                {theme === "light" ? sunIcon : moonIcon}

                <span>{theme === "light" ? "Light" : "Dark"}</span>
              </button>

              {session && (
                <>
                  <button onClick={() => handleNavigate("/like-product")}>
                    <HeartIcon className="text-red-500" />
                    <span>Liked</span>
                  </button>

                  <button onClick={() => modalRef.current?.open()}>
                    <ArrowRightStartOnRectangleIcon />
                    <span>Log out</span>
                  </button>
                </>
              )}

              {!session && (
                <Link href={"/signin"}>
                  <ArrowLeftEndOnRectangleIcon />
                  <span>Sign in</span>
                </Link>
              )}
            </VerticalMenu>
          </PopupWrapper>
        </MyPopupContent>
      </MyPopup>

      <Modal ref={modalRef}>
        <ConfirmModal label="Logout ?" callback={signOut} loading={false} />
      </Modal>
    </>
  );
}
