import { Button, Modal, ModalBody, ModalContent } from '@heroui/react';
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
        <h2 className="text-[20px] font-[400] text-black mb-[24px]">
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
                className={`relative flex-1 rounded-[12px] transition-all duration-300 ease-in-out`}
                // onClick={isHoverable ? handleClick : undefined}
              >
                <Image
                  key={step.alt}
                  src={step.src}
                  alt={step.alt}
                  width={220}
                  height={260}
                  className="w-full h-auto"
                />

                {isHoverable && (
                  <Button
                    className="absolute bottom-[10%] left-[50%] translate-x-[-50%] w-[67px] h-[24px] text-[11px] rounded-[6px] font-[400] text-white bg-black hover:bg-[#448aff]"
                    onClick={isHoverable ? handleClick : undefined}
                  >
                    Try Now
                  </Button>
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
            <div className="p-8 flex flex-col items-center justify-center ">
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
          className="absolute left-[50%] text-[12px] translate-x-[-50%] bottom-[24px] px-[16px] text-[#828282] h-[45px] flex items-center justify-center bg-[#F2F7FF] rounded-full cursor-pointer hover:bg-[#E2E8F0]"
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
