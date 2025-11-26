// 简化版 SidebarItem 组件 - 轻量优雅的列表项展示

import {
  DocumentTextIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import {
  Button,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import React, { useEffect, useRef, useState } from 'react';

import { addToast } from '@/components/base/toast';
import { createClient } from '@/lib/supabase/client';
import { useArticleStore } from '@/stores/articleStore';

import { SidebarItemProps } from '../types/sidebar.types';

export const SidebarItem: React.FC<SidebarItemProps> = React.memo(
  ({ item, onClick, isSelected = false, onRefresh }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [newTitle, setNewTitle] = useState(item.title);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { updateArticle, removeArticle } = useArticleStore();

    const handleClick = () => {
      if (!isRenaming) {
        onClick(item);
      }
    };

    const handleDropdownToggle = (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowDropdown(!showDropdown);
    };

    const handleRename = () => {
      setIsRenaming(true);
      setShowDropdown(false);
      setNewTitle(item.title);
    };

    // 重命名提交
    const handleRenameSubmit = async () => {
      if (!newTitle.trim() || newTitle === item.title) {
        setIsRenaming(false);
        return;
      }

      if (isSaving) return; // 防止重复提交

      setIsSaving(true);

      try {
        // 1. 更新本地状态
        updateArticle(item.id, { title: newTitle.trim() });

        // 2. 更新 Supabase 数据库
        // 注意：item.id 是 "tweet-${realId}" 格式，需要使用真实的数据库ID
        const realId = item.tweetData?.id || item.id.replace('tweet-', '');

        const supabase = createClient();
        const { error } = await supabase
          .from('tweet_thread')
          .update({
            topic: newTitle.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', realId);

        if (error) {
          throw error;
        }

        // 3. 显示成功提示
        addToast({
          title: 'Success',
          color: 'success',
        });

        // 4. 刷新侧边栏列表
        if (onRefresh) {
          await onRefresh();
        }
      } catch (error) {
        // 回滚本地状态
        updateArticle(item.id, { title: item.title });

        addToast({
          title: 'Error',
          color: 'danger',
        });
      } finally {
        setIsSaving(false);
        setIsRenaming(false);
      }
    };

    const handleRenameCancel = () => {
      setNewTitle(item.title);
      setIsRenaming(false);
    };

    const handleDelete = () => {
      setShowDropdown(false);
      setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
      if (isDeleting) return; // 防止重复提交

      setIsDeleting(true);

      try {
        // 1. 从本地状态中移除
        removeArticle(item.id);

        // 2. 从 Supabase 数据库中删除
        // 注意：item.id 是 "tweet-${realId}" 格式，需要使用真实的数据库ID
        const realId = item.tweetData?.id || item.id.replace('tweet-', '');

        const supabase = createClient();
        const { error } = await supabase
          .from('tweet_thread')
          .delete()
          .eq('id', realId);

        if (error) {
          throw error;
        }

        // 3. 删除成功后，立即显示成功提示（覆盖"Deleting"Toast）
        addToast({
          title: 'Deleted',
          color: 'success',
        });

        // 4. 刷新侧边栏列表
        if (onRefresh) {
          await onRefresh();
        }
      } catch (error) {
        // 回滚本地状态（重新添加文章到列表）
        // 注意：这里无法完全回滚，因为我们已经从列表中移除了
        // 最好的做法是刷新列表来恢复数据
        if (onRefresh) {
          await onRefresh();
        }

        // 删除失败时，显示错误提示（覆盖"Deleting"Toast）
        addToast({
          title: 'Error',
          color: 'danger',
        });
      } finally {
        setIsDeleting(false);
        setShowDeleteModal(false);
      }
    };

    const handleDeleteCancel = () => {
      setShowDeleteModal(false);
    };

    // 处理输入框键盘事件
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleRenameSubmit();
      } else if (e.key === 'Escape') {
        handleRenameCancel();
      }
    };

    // 点击外部关闭下拉菜单
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setShowDropdown(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    // 聚焦输入框
    useEffect(() => {
      if (isRenaming && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, [isRenaming]);

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return '今天';
      } else if (diffDays === 1) {
        return '昨天';
      } else if (diffDays < 7) {
        return `${diffDays}天前`;
      } else {
        return date.toLocaleDateString('zh-CN', {
          month: 'short',
          day: 'numeric',
        });
      }
    };

    return (
      <>
        <div
          className={`
            group relative flex h-[40px] cursor-pointer items-center justify-between rounded-[8px] px-[8px] py-[2px]
            transition-all duration-200 ease-in-out
            ${isRenaming ? '' : 'hover:bg-[#E8E8E8] hover:shadow-sm'}
            ${isSelected ? 'border-l-4 border-blue-500 bg-blue-50' : ''}
            ${isRenaming ? 'bg-[#DDE9FF]' : ''}
          `}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick();
            }
          }}
          aria-label={`选择 ${item.title}`}
          data-sidebar-item-id={item.id}
          data-testid={`sidebar-item-${item.id}`}
        >
          <div className="flex min-w-0 flex-1 items-center space-x-3">
            {/* 文档图标 */}
            <div className="shrink-0">
              <DocumentTextIcon
                className={`
                  size-4 transition-colors duration-200
                  ${isSelected ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}
                `}
              />
            </div>

            {/* 内容区域 */}
            <div className="flex min-w-0 flex-1 flex-col">
              {/* 标题 - 重命名时显示输入框 */}
              {isRenaming ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleRenameSubmit}
                  disabled={isSaving}
                  className={`w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                    isSaving ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                  placeholder={isSaving ? '保存中...' : '输入新标题'}
                />
              ) : (
                <h3
                  className={`
                    truncate text-sm font-medium transition-colors duration-200
                    ${isSelected ? 'text-blue-900' : 'text-gray-900 group-hover:text-gray-800'}
                  `}
                  title={item.title}
                >
                  {item.title}
                </h3>
              )}

              {/* 时间信息 */}
              {/* <p 
                className={`
                  mt-0.5 text-xs transition-colors duration-200
                  ${isSelected ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-600'}
                `}
              >
                {formatDate(item.updatedAt || item.createdAt)}
              </p> */}
            </div>
          </div>

          {/* 右侧操作区域 */}
          <div className="flex items-center space-x-2">
            {/* 选中指示器 */}
            {isSelected && (
              <div className="shrink-0">
                <div className="size-2 rounded-full bg-blue-500"></div>
              </div>
            )}

            {/* 三个点菜单按钮 */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleDropdownToggle}
                className={`
                  flex size-6 items-center justify-center rounded opacity-0 transition-colors duration-200 hover:bg-[#D7D7D7] group-hover:opacity-100
                `}
                aria-label="更多操作"
              >
                <EllipsisHorizontalIcon className="size-4 text-gray-600" />
              </button>

              {/* 下拉菜单 */}
              {showDropdown && (
                <div className="absolute right-0 top-8 z-50 w-32 rounded-md bg-white shadow-lg ring-1 ring-black/5">
                  <div className="py-1">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRename();
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Image src="/icons/rename.svg" width={16} height={16} />
                      <span className="ml-[8px]">Rename</span>
                    </button>
                    <Divider />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete();
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Image src="/icons/delete.svg" width={16} height={16} />{' '}
                      <span className="ml-[8px]">Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 删除Loading遮罩 */}
          {isDeleting && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[8px] bg-[#E8E8E8] opacity-90">
              <div className="flex items-center">
                <Image
                  src="/icons/loading.gif"
                  width={24}
                  height={24}
                  alt="Loading"
                />
              </div>
            </div>
          )}
        </div>

        {/* 删除确认弹窗 - 使用 @heroui Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={handleDeleteCancel}
          size="lg"
          classNames={{
            base: 'w-[560px]',
            backdrop: 'bg-black/50',
          }}
        >
          <ModalContent
            className="bg-white p-6"
            style={{
              borderRadius: '20px',
              boxShadow: '0 0 15px rgba(95, 99, 110, 0.1)',
            }}
          >
            {(onClose) => (
              <>
                <ModalHeader className="p-0 pb-3">
                  <h3
                    className="text-lg font-medium text-gray-900"
                    style={{
                      fontFamily: 'Poppins',
                      fontSize: '18px',
                      fontWeight: '500',
                      lineHeight: '28px',
                    }}
                  >
                    Delete this article?
                  </h3>
                </ModalHeader>

                <ModalBody className="p-0 pb-6">
                  <p
                    className="text-sm text-[000]"
                    style={{
                      fontFamily: 'Poppins',
                      fontSize: '14px',
                      fontWeight: '400',
                      lineHeight: '20px',
                    }}
                  >
                    Are you sure you want to delete this content? This action is
                    permanent — you won’t be able to find it again.
                  </p>
                </ModalBody>

                <ModalFooter className="justify-end gap-3 p-0">
                  <Button
                    variant="bordered"
                    radius="full"
                    size="md"
                    onPress={onClose}
                    className="h-10 border-gray-300 px-6 font-normal text-gray-700"
                    style={{ fontFamily: 'Poppins' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="danger"
                    radius="full"
                    size="md"
                    onPress={() => {
                      handleDeleteConfirm();
                      onClose();
                    }}
                    isLoading={isDeleting}
                    disabled={isDeleting}
                    className="h-10 bg-[#E33629] px-6 font-normal"
                    style={{ fontFamily: 'Poppins' }}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  },
  (prevProps, nextProps) => {
    // 优化渲染性能的比较函数
    return (
      prevProps.item.id === nextProps.item.id &&
      prevProps.item.title === nextProps.item.title &&
      prevProps.item.updatedAt === nextProps.item.updatedAt &&
      prevProps.isSelected === nextProps.isSelected
    );
  },
);

SidebarItem.displayName = 'SidebarItem';
