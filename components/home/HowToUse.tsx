import { Modal, ModalBody, ModalContent } from '@heroui/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const HowToUse = ({
  showInModal = false,
}: {
  showInModal?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const router = useRouter();

  // 处理 stepOne 点击 - 跳转到设置页面
  const handleStepOneClick = () => {
    router.push('/profile');
  };

  // 处理 stepTwo 点击 - 关闭弹窗并滚动到 Trending Topics
  const handleStepTwoClick = () => {
    if (showInModal && isOpen) {
      setIsOpen(false); // 关闭弹窗
    }

    // 滚动到 Trending Topics 模块
    setTimeout(() => {
      const trendingElement = document.querySelector('#trending-topics');
      if (trendingElement) {
        trendingElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest',
        });
      }
    }, 300); // 等待弹窗关闭动画完成
  };

  const steps = [
    {
      src: '/home/StepOne.png',
      alt: 'Step One',
    },
    {
      src: '/home/StepTwo.png',
      alt: 'Step Two',
    },
    {
      src: '/home/StepThree.png',
      alt: 'Step Three',
    },
    {
      src: '/home/StepFour.png',
      alt: 'Step Four',
    },
  ];

  const renderContext = () => {
    return (
      <div className="flex flex-col items-center justify-center">
        <h2 className="mb-[24px] text-[20px] font-[400] text-black">
          How to use Influxy?
        </h2>

        <div className="flex flex-row items-center justify-center gap-[8px]">
          {steps.map((step, index) => {
            // 为 stepone 和 steptwo 添加特殊的 hover 动画
            const isHoverable =
              step.alt === 'Step One' || step.alt === 'Step Two';

            // 根据步骤类型添加不同的点击处理
            const handleClick = () => {
              if (step.alt === 'Step One') {
                handleStepOneClick();
              } else if (step.alt === 'Step Two') {
                handleStepTwoClick();
              }
            };

            return (
              <div
                key={step.alt}
                className={`relative flex-1 rounded-[12px] `}
                // onClick={isHoverable ? handleClick : undefined}
              >
                <Image
                  key={step.alt}
                  src={step.src}
                  alt={step.alt}
                  width={220}
                  height={260}
                  className="h-auto w-full"
                />

                {isHoverable && (
                  <div
                    className="hover:opacity-100! absolute bottom-[10%] left-[50%] flex h-[24px] w-[67px] translate-x-[-50%] cursor-pointer items-center justify-center rounded-[6px] bg-black text-[11px] font-[400] text-white transition-all duration-300 ease-in-out hover:bg-[#448aff]"
                    onClick={isHoverable ? handleClick : undefined}
                  >
                    Try Now
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderHowToUseModal = () => {
    return (
      <Modal size="5xl" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent>
          <ModalBody>
            <div className="flex flex-col items-center justify-center p-8 ">
              {renderContext()}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };
  return showInModal ? (
    <>
      {!hidden && (
        <div
          onClick={() => setIsOpen(true)}
          className="absolute bottom-[24px] left-[50%] flex h-[45px] translate-x-[-50%] cursor-pointer items-center justify-center rounded-full bg-[#F2F7FF] px-[16px] text-[12px] text-[#828282] hover:bg-[#E2E8F0]"
        >
          How to use Influxy{' '}
          <Image
            className="ml-[16px] cursor-pointer"
            src="/icons/close.svg"
            alt="close"
            width={16}
            height={16}
            onClick={(e) => {
              e.stopPropagation();
              setHidden(true);
            }}
          />
        </div>
      )}
      {renderHowToUseModal()}
    </>
  ) : (
    renderContext()
  );
};
