'use client';

import { useEffect, useState } from 'react';
import { Button, Modal, ModalContent } from '@heroui/react';
import { motion } from 'framer-motion';

const STORAGE_KEY = 'shutdown-notice-dismissed';

export default function ShutdownNoticeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem(STORAGE_KEY, '1');
    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="2xl"
      placement="center"
      hideCloseButton
      isDismissable={false}
      classNames={{
        backdrop: 'bg-black/50',
        base: 'border-0 max-w-[520px]',
        body: 'p-0',
        header: 'p-0 border-0',
        footer: 'border-0',
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.3, ease: 'easeOut' },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: { duration: 0.2, ease: 'easeIn' },
          },
        },
      }}
    >
      <ModalContent className="bg-white">
        <div className="flex flex-col gap-6 rounded-[20px] bg-white p-8 shadow-[0_0_15px_rgba(95,99,110,0.1)]">
          {/* Header */}
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-4xl">💛</span>
            <h2 className="text-xl font-semibold text-black">
              Service Shutdown Notice
            </h2>
            <p className="text-sm text-gray-400">停服公告</p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100" />

          {/* English */}
          <div className="flex flex-col gap-2">
            <p className="text-[15px] leading-relaxed text-gray-700">
              Dear user,
            </p>
            <p className="text-[15px] leading-relaxed text-gray-700">
              Our product will stop maintenance and will be{' '}
              <span className="font-semibold text-black">
                permanently shut down on March 31, 2026
              </span>
              .
            </p>
            <p className="text-[15px] leading-relaxed text-gray-700">
              Please manage or cancel your subscription before then.
            </p>
            <p className="text-[15px] leading-relaxed text-gray-700">
              Thank you for your support and companionship.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100" />

          {/* Chinese */}
          <div className="flex flex-col gap-2">
            <p className="text-[15px] leading-relaxed text-gray-700">
              亲爱的用户，
            </p>
            <p className="text-[15px] leading-relaxed text-gray-700">
              我们的产品将停止维护，并于{' '}
              <span className="font-semibold text-black">
                2026 年 3 月 31 日
              </span>{' '}
              正式关闭。
            </p>
            <p className="text-[15px] leading-relaxed text-gray-700">
              请您在此之前自行管理或取消订阅。
            </p>
            <p className="text-[15px] leading-relaxed text-gray-700">
              感谢您一直以来的支持与陪伴。
            </p>
          </div>

          {/* Action */}
          <div className="flex justify-center pt-1">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onPress={handleClose}
                className="h-10 rounded-[10px] bg-[#448AFF] px-10 text-[15px] font-medium text-white hover:bg-[#3B7CE6]"
              >
                I Understand / 我已知晓
              </Button>
            </motion.div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
