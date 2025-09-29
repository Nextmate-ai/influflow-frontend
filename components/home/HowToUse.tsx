import { Modal, ModalBody, ModalContent } from '@heroui/react';
import Image from 'next/image';
import { useState } from 'react';

export const HowToUse = ({
  showInModal = false,
}: {
  showInModal?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  const steps = [
    {
      src: '/home/StepOne.svg',
      alt: 'Step One',
    },
    {
      src: '/home/StepTwo.svg',
      alt: 'Step Two',
    },
    {
      src: '/home/StepThree.svg',
      alt: 'Step Three',
    },
    {
      src: '/home/StepFour.svg',
      alt: 'Step Four',
    },
  ];

  const renderContext = () => {
    return (
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-[36px] font-[400] text-black">
          How to use Influxy?
        </h2>

        <div className="flex flex-row items-center justify-center gap-[8px]">
          {steps.map((step) => (
            <div key={step.alt} className="flex-1 rounded-[12px]">
              <Image
                key={step.alt}
                src={step.src}
                alt={step.alt}
                width={220}
                height={260}
                className="w-full h-auto"
              />
            </div>
          ))}
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
          className="absolute left-[50%] translate-x-[-50%] bottom-[24px] px-[24px] text-[#828282] h-[45px] flex items-center justify-center bg-[#F2F7FF] rounded-full"
        >
          How to use Influxy{' '}
          <Image
            className="ml-[24px] cursor-pointer"
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
