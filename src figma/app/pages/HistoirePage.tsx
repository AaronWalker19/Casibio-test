import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function HistoirePage() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center relative size-full">
      <Navigation />
      <div className="bg-[#183542] content-stretch flex flex-col gap-[20px] items-start px-[50px] py-[50px] relative shrink-0 w-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[96px] text-[#ff404a] w-full">
          Projet ANR Casibio
        </p>
        <Link to="/articles" className="content-stretch flex gap-[10px] items-center relative shrink-0">
          <div className="relative shrink-0 size-[30px]" data-name="tabler:books">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
              <g>
                <path d="M6.25 5.625V24.375M6.25 5.625C6.25 5.625 8.75 3.75 12.5 3.75C16.25 3.75 18.75 5.625 18.75 5.625M6.25 5.625C6.25 5.625 3.75 3.75 0 3.75V24.375C3.75 24.375 6.25 26.25 6.25 26.25M18.75 5.625V24.375M18.75 5.625C18.75 5.625 21.25 3.75 25 3.75C28.75 3.75 30 5.625 30 5.625V24.375C30 24.375 28.75 22.5 25 22.5C21.25 22.5 18.75 24.375 18.75 24.375M18.75 24.375C18.75 24.375 16.25 22.5 12.5 22.5C8.75 22.5 6.25 24.375 6.25 24.375" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </g>
            </svg>
          </div>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[32px] text-white whitespace-nowrap">
            Articles
          </p>
          <div className="relative shrink-0 size-[30px]" data-name="weui:arrow-filled">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
              <path clipRule="evenodd" d="M12.2344 7.73438L18.5156 14.0156C18.6719 14.1719 18.75 14.375 18.75 14.625C18.75 14.875 18.6719 15.0781 18.5156 15.2344L12.2344 21.5156C11.9219 21.8281 11.4531 21.8281 11.1406 21.5156C10.8281 21.2031 10.8281 20.7344 11.1406 20.4219L16.9375 14.625L11.1406 8.82812C10.8281 8.51562 10.8281 8.04688 11.1406 7.73438C11.4531 7.42188 11.9219 7.42188 12.2344 7.73438Z" fill="white" fillRule="evenodd" />
            </svg>
          </div>
        </Link>
      </div>
      <div className="relative shrink-0 w-full">
        <div aria-hidden="true" className="absolute border-[#f3f3f5] border-b border-solid inset-0 pointer-events-none" />
        <div className="flex flex-col items-center size-full">
          <div className="content-stretch flex gap-[50px] items-start p-[50px] relative w-full">
            <div className="flex-1 content-stretch flex flex-col gap-[40px] items-start relative">
              <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full">
                <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[48px] text-black w-full">
                  Dernières publication
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[32px] text-black w-full">
                  Découvrez nos travaux et avancements recents
                </p>
              </div>
              <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 w-full">
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16px] text-black text-justify w-full">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut rutrum nisl. Aliquam neque odio, imperdiet at dui et, maximus congue massa. Sed nec nulla tincidunt metus faucibus semper. Vivamus iaculis et nibh in lobortis. Sed consequat pharetra pellentesque convallis. In hac habitasse platea dictumst. Phasellus fringilla tempor lectus, sit amet ultrices justo dapibus ut. Suspendisse ultrices elementum libero vitae tristique.
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16px] text-black text-justify w-full">
                  Ut lorem, adipisci at varius eu, malesuada eu mauris. Etiam sit amet ipsa cursus, faucibus nisl vitae, dictum augue. Nullam tincidunt dignissim porta. Aliquam vestibulum lacus dictumst. Phasellus fringilla semper orci vitae tempus. Suspendisse ultrices elementum libero vitae tristique.
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16px] text-black text-justify w-full">
                  Integer eget lacus iaculorum, pellentesque nisl tempor, iaculis sapien. Curabitur mattis vehicula nibh, in dignissim lacus. Quisque tincidunt, mauris ac lacinia ultrices, vel etiam lacus ultrices, mollis eu enim ultrices, mollis eu lorem lacus. Proin vitae lorem mauris. Nunc vestibulum pellentesque maximus sed aliquam enim. Morbi varius, risus ut ornare aliquet, sem aliquem sapien ex turpis molestie semper. Nulla aliquam lacus nisl efficitur blandit.
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16px] text-black text-justify w-full">
                  Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean gravida malesuada feugiat. Morbi facilisis, est tincidunt iaculis urna nisl vel sed. Nulla metus. Sed aliquam sapien ex turpis molestie semper. Nulla aliquam lacus nisl efficitur blandit. Nullam phaeret nisl efficitur blandit. In nec diam lacus feugiat bibendum. Aenean ultrices auctor leo et nibh ac ipsum ultricies malesuada. Sed a lacinia mollis dictum. Quisque tellus. Sed bibendum iaculis leo et sed aliquam orci et eros venenatis sollicitudin.
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16px] text-black text-justify w-full">
                  Maecenas eu ipsum et nulla imperdiet placerat in et odio. Sed faucibus feugiat erat, sed pellentesque eros imperdiet nec. Vivamus a nibh non urna faucibus porta. Maecenas tempor congue nisl at lorem. Quisque tincidunt nec mi quis vestibulum ultrices vitae eu arcu. Phasellus dictum orci sit elit quam non elit nisl hendrerit faucibus vitae, etiam pulvinar tristique nibh, semper volutpat quam sagittis vitae. Phasellus dictum orci sit vel lorem tempus tincidunt. Praesent quam nisl nec mien nisl vestibulum imperdiet vitae et arcu.
                </p>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-[400px]">
              <div className="bg-[#f3f3f5] content-stretch flex flex-col gap-[10px] items-start p-[20px] relative rounded-[4px] shrink-0 w-full">
                <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[24px] text-black w-full">
                  Sommaire
                </p>
                <div className="content-stretch flex flex-col gap-[5px] items-start relative shrink-0 w-full">
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-black w-full">
                    Histoire
                  </p>
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-black w-full">
                    Histoire
                  </p>
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-black w-full">
                    Histoire
                  </p>
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-black w-full">
                    Histoire
                  </p>
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-black w-full">
                    Histoire
                  </p>
                </div>
              </div>
              <div className="bg-[#f3f3f5] content-stretch flex flex-col gap-[10px] items-start p-[20px] relative rounded-[4px] shrink-0 w-full">
                <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[24px] text-black w-full">
                  Fichier de l'article
                </p>
                <div className="h-[200px] relative shrink-0 w-full">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1581093449818-2655b2467fd6?w=400&h=200&fit=crop"
                    alt="Article file"
                    className="w-full h-full object-cover rounded-[4px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative shrink-0 w-full">
        <div aria-hidden="true" className="absolute border-[#f3f3f5] border-b border-solid border-t inset-0 pointer-events-none" />
        <div className="flex flex-col items-center size-full">
          <div className="content-stretch flex flex-col gap-[40px] items-start p-[50px] relative w-full">
            <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full">
              <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[48px] text-black w-full">
                Dernières publication
              </p>
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[32px] text-black w-full">
                Découvrez nos travaux et avancements recents
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 w-full">
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16px] text-black text-justify w-full">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut rutrum nisl. Aliquam neque odio, imperdiet at dui et, maximus congue massa. Sed nec nulla tincidunt metus faucibus semper. Vivamus iaculis et nibh in lobortis. Sed consequat pharetra pellentesque convallis. In hac habitasse platea dictumst. Phasellus fringilla tempor lectus, sit amet ultrices justo dapibus ut. Suspendisse ultrices elementum libero vitae tristique.
              </p>
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16px] text-black text-justify w-full">
                Ut lorem, adipisci at varius eu, malesuada eu mauris. Etiam sit amet ipsa cursus, faucibus nisl vitae, dictum augue. Nullam tincidunt dignissim porta. Aliquam vestibulum lacus dictumst. Phasellus fringilla semper orci vitae tempus. Suspendisse ultrices elementum libero vitae tristique.
              </p>
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16px] text-black text-justify w-full">
                Integer eget lacus iaculorum, pellentesque nisl tempor, iaculis sapien. Curabitur mattis vehicula nibh, in dignissim lacus. Quisque tincidunt, mauris ac lacinia ultrices, vel etiam lacus ultrices, mollis eu enim ultrices, mollis eu lorem lacus. Proin vitae lorem mauris. Nunc vestibulum pellentesque maximus sed aliquam enim. Morbi varius, risus ut ornare aliquet, sem aliquem sapien ex turpis molestie semper. Nulla aliquam lacus nisl efficitur blandit.
              </p>
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16px] text-black text-justify w-full">
                Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean gravida malesuada feugiat. Morbi facilisis, est tincidunt iaculis urna nisl vel sed. Nulla metus. Sed aliquam sapien ex turpis molestie semper. Nulla aliquam lacus nisl efficitur blandit. Nullam phaeret nisl efficitur blandit. In nec diam lacus feugiat bibendum. Aenean ultrices auctor leo et nibh ac ipsum ultricies malesuada. Sed a lacinia mollis dictum. Quisque tellus. Sed bibendum iaculis leo et sed aliquam orci et eros venenatis sollicitudin.
              </p>
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16px] text-black text-justify w-full">
                Maecenas eu ipsum et nulla imperdiet placerat in et odio. Sed faucibus feugiat erat, sed pellentesque eros imperdiet nec. Vivamus a nibh non urna faucibus porta. Maecenas tempor congue nisl at lorem. Quisque tincidunt nec mi quis vestibulum ultrices vitae eu arcu.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
