'use client';

import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ReactFlowProvider } from 'reactflow';

import { addToast } from '@/components/base/toast';
import {
  getErrorMessage,
  getTwitterAuthUrl,
  useCheckTwitterAuthStatus,
  useGenerateImage,
  useModifyOutline,
  usePostToTwitter,
  type TwitterPostRequest,
  type TwitterTweetData,
} from '@/lib/api/services';
import {
  convertAPIDataToGeneratedContent,
  convertAPIDataToMarkdown,
  convertMindmapToMarkdown,
  convertThreadDataToMindmap,
} from '@/lib/data/converters';
import { createClient } from '@/lib/supabase/client';
import {
  GeneratedContent,
  MindmapEdgeData,
  MindmapNodeData,
} from '@/types/content';
import { Outline, TweetContentItem } from '@/types/outline';

import EditableContentMindmap from './EditableContentMindmap';
import { EnhancedMarkdownRenderer } from './EnhancedMarkdownRenderer';
import { ImageEditModal } from './ImageEditModal';
import { SseLoading } from './SseLoading';

interface EnhancedContentGenerationProps {
  topic: string;
  onBack: () => void;
  initialData?: Outline;
  onDataUpdate?: () => void; // 新增：数据更新回调
}

export function EnhancedContentGeneration({
  topic,
  onBack,
  initialData,
  onDataUpdate,
}: EnhancedContentGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] =
    useState<GeneratedContent | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(
    null,
  );
  const [generationStep, setGenerationStep] = useState(0);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [currentNodes, setCurrentNodes] = useState<MindmapNodeData[]>([]);
  const [currentEdges, setCurrentEdges] = useState<MindmapEdgeData[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  // 重复请求防止逻辑已迁移到 SseLoading 组件
  const [rawAPIData, setRawAPIData] = useState<Outline | null>(null); // 存储原始API数据
  const [hoveredTweetId, setHoveredTweetId] = useState<string | null>(null); // hover状态
  const [isImageEditModalOpen, setIsImageEditModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<{
    url: string;
    alt: string;
    caption?: string;
    prompt?: string;
  } | null>(null);
  const [editingTweetData, setEditingTweetData] = useState<any | null>(null); // 新增：正在编辑的tweet 数据

  const [regeneratedMarkdown, setRegeneratedMarkdown] = useState<string | null>(
    null,
  ); // 重新生成的markdown
  const [loadingTweetId] = useState<string | null>(null); // markdown loading状态
  const [generatingImageTweetIds, setGeneratingImageTweetIds] = useState<
    string[]
  >([]); // 正在生图的tweetId数组
  const [scrollToSection, setScrollToSection] = useState<string | null>(null); // 滚动到指定section
  const [isPostingToTwitter, setIsPostingToTwitter] = useState(false); // Twitter发布loading状态

  // 辅助函数：添加正在生图的 tweetId
  const addGeneratingImageTweetId = useCallback((tweetId: string) => {
    setGeneratingImageTweetIds((prev) => [
      ...prev.filter((id) => id !== tweetId),
      tweetId,
    ]);
  }, []);

  // 辅助函数：移除正在生图的 tweetId
  const removeGeneratingImageTweetId = useCallback((tweetId: string) => {
    setGeneratingImageTweetIds((prev) => prev.filter((id) => id !== tweetId));
  }, []);

  // 辅助函数：清空所有正在生图的 tweetId
  const clearGeneratingImageTweetIds = useCallback(() => {
    setGeneratingImageTweetIds([]);
  }, []);

  // 辅助函数：检查是否正在生图
  const isGeneratingImage = useCallback(
    (tweetId: string | null | undefined) => {
      return tweetId ? generatingImageTweetIds.includes(tweetId) : false;
    },
    [generatingImageTweetIds],
  );

  // 使用 ref 来追踪请求状态，避免严格模式下的重复执行
  const requestIdRef = useRef<string | null>(null);

  // 清除滚动状态，防止重复滚动
  useEffect(() => {
    if (scrollToSection) {
      // 在滚动执行后清除状态，延迟时间应该比EnhancedMarkdownRenderer中的延迟时间长
      const timer = setTimeout(() => {
        setScrollToSection(null);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [scrollToSection]);

  // 用户信息和API调用已迁移到 SseLoading 组件
  const modifyOutlineMutation = useModifyOutline();
  const generateImageMutation = useGenerateImage();
  const postToTwitterMutation = usePostToTwitter();
  const { data: twitterAuthStatus, refetch: refetchTwitterAuthStatus } =
    useCheckTwitterAuthStatus();

  // 生成步骤已迁移到 SseLoading 组件

  // 当topic变化时重置状态并启动生成
  useEffect(() => {
    if (topic && !initialData) {
      // 重置所有状态
      setGeneratedContent(null);
      setRawAPIData(null);
      setApiError(null);
      // setHasStartedGeneration(false);
      setGenerationStep(0);
      setIsRegenerating(false);
      requestIdRef.current = null;

      // 启动生成过程
      setIsGenerating(true);
    }
  }, [topic, initialData]);

  // 新增：处理 initialData 的逻辑
  useEffect(() => {
    if (initialData) {
      // 如果有初始数据，直接渲染，跳过 API 调用
      setRawAPIData(initialData);
      const content = convertAPIDataToGeneratedContent(initialData);
      setGeneratedContent(content);
      setCurrentNodes(content.mindmap.nodes);
      setCurrentEdges(content.mindmap.edges);
      setIsGenerating(false);
    }
  }, [initialData]);

  // AI生成过程已迁移到 SseLoading 组件

  const handleNodeSelect = useCallback(
    (nodeId: string | null) => {
      setSelectedNodeId(nodeId);

      // 根据选中的节点高亮对应的推文
      if (nodeId && currentNodes) {
        const node = currentNodes.find((n) => n.id === nodeId);
        if (node && node.data?.tweetId) {
          const tweetId = node.data.tweetId.toString();
          setHoveredTweetId(tweetId);
          // 设置滚动目标为tweetId
          setScrollToSection(tweetId);
        } else if (node && node.data?.groupIndex !== undefined) {
          // 如果是group节点，滚动到group
          const groupId = `group-${node.data.groupIndex}`;
          setHoveredTweetId(groupId);
          setScrollToSection(groupId);
        } else {
          setHoveredTweetId(null);
          setScrollToSection(null);
        }
      } else {
        setHoveredTweetId(null);
        setScrollToSection(null);
      }
    },
    [currentNodes],
  );

  // 处理思维导图节点的 hover 事件
  const handleNodeHover = useCallback((tweetId: string | null) => {
    console.log(
      'EnhancedContentGeneration handleNodeHover called with:',
      tweetId,
    );
    setHoveredTweetId(tweetId);
  }, []);

  // 处理 markdown 区域的 hover 事件（从 markdown 到思维导图的反向联动）
  const handleMarkdownHover = useCallback((tweetId: string | null) => {
    setHoveredTweetId(tweetId);
  }, []);

  // loading 状态处理已迁移到 SseLoading 组件

  // 处理图片点击事件
  const handleImageClick = useCallback(
    (image: {
      url: string;
      alt: string;
      caption?: string;
      prompt?: string;
    }) => {
      setEditingImage(image);
      setIsImageEditModalOpen(true);
    },
    [],
  );

  /**
   * 更新或插入Tweet图片的Markdown内容
   * @param fullContent - 完整的Markdown字符串
   * @param tweetNumber - 目标Tweet的编号
   * @param newImageUrl - 新图片的URL
   * @param tweetText - Tweet的文本，用于alt标签
   * @returns 更新后的完整Markdown字符串
   */
  const updateTweetImageInContent = (
    fullContent: string,
    tweetNumber: string,
    newImageUrl: string,
    tweetText: string,
  ): string => {
    const imageMarkdown = `\n\n![${tweetText}](${newImageUrl})`;
    const tweetDivRegex = new RegExp(
      `(<div\s+data-tweet-id="${tweetNumber}"[^>]*>[\s\S]*?)(<\/div>)`,
    );
    const tweetBlockMatch = fullContent.match(tweetDivRegex);

    if (!tweetBlockMatch) {
      return fullContent;
    }

    const tweetBlock = tweetBlockMatch[0];
    const imageRegex = /!\[.*?\]\(https?:\/\/[^\s)]+\)/g;

    // 如果Tweet区块内已有图片，则替换它
    if (imageRegex.test(tweetBlock)) {
      const result = fullContent.replace(
        tweetBlock,
        tweetBlock.replace(imageRegex, imageMarkdown.trim()),
      );

      return result;
    }
    // 如果没有图片，则在 </div> 前插入
    else {
      const openingDiv = tweetBlockMatch[1];
      const closingDiv = tweetBlockMatch[2];
      const updatedBlock = `${openingDiv.trim()}${imageMarkdown}\n\n${closingDiv}`;
      const result = fullContent.replace(tweetBlock, updatedBlock);
      return result;
    }
  };

  // 新逻辑: 点击后不再自动生成图片，而是直接打开模态框
  const handleTweetImageEdit = useCallback(
    (tweetData: any) => {
      setEditingTweetData(tweetData);
      setEditingImage({
        url: tweetData.image_url || '', // 如果没有图片URL，则传递空字符串
        alt: tweetData.content || tweetData.title || '',
        caption: tweetData.content,
        prompt: tweetData.content || tweetData.title,
      });
      // 设置正在生图的 tweetId，用于高亮显示
      const tweetId = tweetData.tweet_number?.toString();
      if (tweetId) {
        addGeneratingImageTweetId(tweetId);
      }
      setIsImageEditModalOpen(true);
    },
    [addGeneratingImageTweetId],
  );

  // 新逻辑: 精确地将选中的图片URL更新到Markdown中
  const handleImageUpdate = useCallback(
    async (
      newImage: {
        url: string;
        alt: string;
        caption?: string;
        prompt?: string;
      },
      tweetData?: any, // 新增：可选的tweetData参数，用于直接生图场景
    ) => {
      // 优先使用传入的tweetData，如果没有则使用editingTweetData
      const targetTweetData = tweetData || editingTweetData;

      if (!targetTweetData) {
        console.error(
          'handleImageUpdate: tweetData 和 editingTweetData 都为空',
        );
        return;
      }

      const { tweet_number, content: tweetText, title } = targetTweetData;

      // 使用 useState 的函数式更新来避免竞态条件
      // 这样每次更新都基于最新的状态，而不是闭包中的旧状态

      let latestRawAPIData: any = null;

      // 1. 更新 rawAPIData 中的图片URL（使用函数式更新）
      setRawAPIData((prevRawAPIData) => {
        if (!prevRawAPIData) return prevRawAPIData;

        const updatedNodes = prevRawAPIData.nodes.map((group: any) => ({
          ...group,
          tweets: group.tweets.map((tweet: any) =>
            tweet.tweet_number === tweet_number
              ? { ...tweet, image_url: newImage.url }
              : tweet,
          ),
        }));

        latestRawAPIData = { ...prevRawAPIData, nodes: updatedNodes };
        return latestRawAPIData;
      });

      // 2. 更新Markdown内容（使用函数式更新）
      setRegeneratedMarkdown((prevMarkdown) => {
        const currentMarkdown =
          prevMarkdown ||
          (latestRawAPIData ? convertAPIDataToMarkdown(latestRawAPIData) : '');

        const updatedMarkdown = updateTweetImageInContent(
          currentMarkdown,
          tweet_number.toString(),
          newImage.url,
          newImage.alt || tweetText || title,
        );

        return updatedMarkdown;
      });

      // 3. 更新 Supabase 数据库（使用最新的数据）
      if (latestRawAPIData && latestRawAPIData.id) {
        try {
          const supabase = createClient();
          const { error } = await supabase
            .from('tweet_thread')
            .update({ tweets: latestRawAPIData.nodes })
            .eq('id', latestRawAPIData.id);

          if (error) {
            throw error;
          }
          console.log('Tweet image updated successfully in Supabase.');

          // 成功更新后，触发侧边栏数据刷新
          onDataUpdate?.();
        } catch (error) {
          console.error('Error updating tweet image in Supabase:', error);
        }
      }

      // 4. 关闭模态框并重置状态
      setIsImageEditModalOpen(false);
      setEditingImage(null);

      // 只有在使用editingTweetData时才清除它（即从弹窗调用时）
      // 如果是直接生图调用，则不清除，因为状态管理在handleDirectGenerate中
      if (!tweetData) {
        setEditingTweetData(null);
      }

      // 清除生图高亮状态（使用正确的 tweetData）
      const currentTweetId = (
        tweetData || editingTweetData
      )?.tweet_number?.toString();
      if (currentTweetId) {
        removeGeneratingImageTweetId(currentTweetId);
      }
    },
    [editingTweetData, onDataUpdate, removeGeneratingImageTweetId],
  );

  const handleDirectGenerate = useCallback(
    async (tweetData: any) => {
      if (!tweetData) return;

      const tweetId = tweetData.tweet_number?.toString();
      if (!tweetId) return;

      addGeneratingImageTweetId(tweetId);

      try {
        const imageUrl = await generateImageMutation.mutateAsync({
          target_tweet: tweetData.content || tweetData.title || '',
          tweet_thread: rawAPIData
            ? rawAPIData.nodes
                .flatMap((group: any) => group.tweets)
                .map(
                  (tweet: any, index: number) =>
                    `(${index + 1}) ${tweet.content || tweet.title}`,
                )
                .join(' \n')
            : '',
        });

        // 自动应用图片
        const newImage = {
          url: imageUrl,
          alt: tweetData.content || tweetData.title || '',
          caption: tweetData.content,
          prompt: tweetData.content || tweetData.title,
        };

        // 直接调用更新逻辑，将tweetData作为参数传递
        await handleImageUpdate(newImage, tweetData);

        addToast({
          title: 'Image generated successfully',
          color: 'success',
        });
      } catch (error) {
        console.error('Direct image generation failed:', error);
        addToast({
          title: 'Image generation failed',
          color: 'danger',
        });
      } finally {
        // 清除loading状态
        removeGeneratingImageTweetId(tweetId);
        // 注意：不在这里清除editingTweetData，因为handleImageUpdate会清除
      }
    },
    [
      rawAPIData,
      generateImageMutation,
      handleImageUpdate,
      addGeneratingImageTweetId,
      removeGeneratingImageTweetId,
    ],
  );

  const handleTweetContentChange = useCallback(
    async (tweetId: string, newContent: string) => {
      console.log('handleTweetContentChange', tweetId, newContent, rawAPIData);
      if (!rawAPIData || !rawAPIData.id) return;

      // 更新 rawAPIData 状态
      const updatedNodes = rawAPIData.nodes.map((group: any) => ({
        ...group,
        tweets: group.tweets.map((tweet: any) =>
          tweet.tweet_number.toString() === tweetId
            ? { ...tweet, content: newContent }
            : tweet,
        ),
      }));
      const updatedRawAPIData = { ...rawAPIData, nodes: updatedNodes };
      setRawAPIData(updatedRawAPIData);

      // 更新 Supabase
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from('tweet_thread')
          .update({ tweets: updatedRawAPIData.nodes })
          .eq('id', rawAPIData.id);

        if (error) {
          throw error;
        }
        console.log('Tweet content updated successfully in Supabase.');

        // 成功更新后，触发侧边栏数据刷新
        onDataUpdate?.();
      } catch (error) {
        console.error('Error updating tweet content in Supabase:', error);
        // 可以在这里添加一些错误处理逻辑，比如 toast 通知
      }
    },
    [rawAPIData, onDataUpdate],
  );

  // 处理 Regenerate 按钮点击 - 调用 modify-outline API
  const handleRegenerateClick = useCallback(async () => {
    console.log('🔄 Regenerate 按钮被点击了！');
    console.log('rawAPIData:', rawAPIData);
    console.log('currentNodes:', currentNodes);

    if (!rawAPIData) {
      console.error('缺少原始数据，无法重新生成');
      return;
    }

    console.log('开始设置 loading 状态...');
    setIsRegenerating(true);

    try {
      // 从当前思维导图状态构建新的 outline 结构
      const currentOutlineFromMindmap = {
        id: rawAPIData.id,
        topic: rawAPIData.topic,
        nodes: rawAPIData.nodes, // 使用原始结构，但会被思维导图的更改覆盖
        total_tweets: rawAPIData.total_tweets,
      };

      // 构建包含用户编辑的新 outline 结构
      // 这里需要从当前的思维导图节点中提取修改后的数据
      const newOutlineStructure = { ...currentOutlineFromMindmap };

      // 更新主题（如果主题节点被编辑了）
      const topicNode = currentNodes.find((n) => n.type === 'topic');
      if (topicNode) {
        newOutlineStructure.topic = topicNode.label;
      }

      // 更新大纲点和tweets
      const outlineNodes = currentNodes.filter(
        (n) => n.type === 'outline_point',
      );
      const tweetNodes = currentNodes.filter((n) => n.type === 'tweet');

      // 重新构建 nodes 数组
      newOutlineStructure.nodes = outlineNodes.map((outlineNode) => {
        const outlineIndex = outlineNode.data?.outlineIndex;
        const originalNode = rawAPIData.nodes[outlineIndex!] || { tweets: [] };

        // 找到属于这个 outline 的所有 tweets
        const relatedTweets = tweetNodes
          .filter((t) => t.data?.groupIndex === outlineIndex)
          .map((tweetNode) => {
            const originalTweet =
              originalNode.tweets.find(
                (t) => t.tweet_number === tweetNode.data?.tweetId,
              ) || {};

            // 检查标题是否发生变化
            const originalTitle = (originalTweet as any).title;
            const currentTitle = tweetNode.label;
            const titleChanged = currentTitle !== originalTitle;

            console.log('🔍 标题变化检测:', {
              tweetId: tweetNode.data?.tweetId,
              originalTitle,
              currentTitle,
              titleChanged,
              originalTweet,
            });

            const result = {
              ...(originalTweet as TweetContentItem),
              title: tweetNode.label, // 使用编辑后的标题
              tweet_number: tweetNode.data?.tweetId || 0,
              // 如果标题变化了，清空 content，让后端重新生成
              ...(titleChanged && { content: '' }),
            };

            console.log('🔍 构建的推文数据:', result);

            return result;
          });

        return {
          ...originalNode,
          title: outlineNode.label, // 使用编辑后的标题
          tweets: relatedTweets,
        };
      });

      console.log('调用 modify-outline API with:', {
        original_outline: rawAPIData,
        new_outline_structure: newOutlineStructure,
      });

      // 调用 modify-outline API
      const result = await modifyOutlineMutation.mutateAsync({
        original_outline: rawAPIData,
        new_outline_structure: newOutlineStructure,
      });

      if (result.updated_outline) {
        console.log('Regenerate 成功，返回的数据:', result);

        const newOutline = result.updated_outline;

        // 从 Supabase 拉取最新数据确保同步
        try {
          const supabase = createClient();
          const { data: latestData, error } = await supabase
            .from('tweet_thread')
            .select('*')
            .eq('id', rawAPIData.id)
            .single();

          if (error) {
            throw error;
          }

          // 使用从数据库拉取的最新数据
          const syncedOutline = latestData || newOutline;
          console.log('从 Supabase 拉取到的最新数据:', syncedOutline);

          // 更新所有状态
          setRawAPIData(syncedOutline);

          // 重新构建思维导图
          const { nodes: newNodes, edges: newEdges } =
            convertThreadDataToMindmap(syncedOutline);
          setCurrentNodes(newNodes);
          setCurrentEdges(newEdges);

          // 重新生成 markdown
          const newMarkdown = convertAPIDataToMarkdown(syncedOutline);
          setRegeneratedMarkdown(newMarkdown);

          // 更新生成的内容
          if (generatedContent) {
            const updatedContent =
              convertAPIDataToGeneratedContent(syncedOutline);
            setGeneratedContent({
              ...generatedContent,
              ...updatedContent,
            });
          }

          // 触发侧边栏数据刷新
          onDataUpdate?.();
        } catch (dbError) {
          console.error(
            '从 Supabase 拉取数据失败，使用 API 返回的数据:',
            dbError,
          );

          // 如果数据库拉取失败，使用 API 返回的数据作为备选
          setRawAPIData(newOutline);

          // 重新构建思维导图
          const { nodes: newNodes, edges: newEdges } =
            convertThreadDataToMindmap(newOutline);
          setCurrentNodes(newNodes);
          setCurrentEdges(newEdges);

          // 重新生成 markdown
          const newMarkdown = convertAPIDataToMarkdown(newOutline);
          setRegeneratedMarkdown(newMarkdown);

          // 更新生成的内容
          if (generatedContent) {
            const updatedContent = convertAPIDataToGeneratedContent(newOutline);
            setGeneratedContent({
              ...generatedContent,
              ...updatedContent,
            });
          }
        }
      }
    } catch (error) {
      console.error('Regenerate 失败:', error);
    } finally {
      setIsRegenerating(false);
    }
  }, [
    rawAPIData,
    currentNodes,
    currentEdges,
    modifyOutlineMutation,
    generatedContent,
  ]);

  const handleSourceClick = useCallback((sectionId: string) => {
    // 显示信息来源弹窗或侧边栏
    console.log('显示信息来源:', sectionId);
    // TODO: 实现信息来源展示功能
  }, []);

  // 处理思维导图节点变化
  const handleNodesChange = useCallback((newNodes: MindmapNodeData[]) => {
    setCurrentNodes(newNodes);
  }, []);

  const handleEdgesChange = useCallback((newEdges: MindmapEdgeData[]) => {
    setCurrentEdges(newEdges);
  }, []);

  // 基于思维导图本地更新内容（不调用API）
  const regenerateFromMindmap = useCallback(
    (newMarkdown?: string) => {
      console.log(
        'Local regenerating from mindmap with markdown:',
        newMarkdown ? 'provided' : 'generated',
      );

      // 本地更新markdown显示
      const finalMarkdown =
        newMarkdown || convertMindmapToMarkdown(currentNodes, currentEdges);

      // 保存新的markdown供EnhancedMarkdownRenderer使用
      setRegeneratedMarkdown(finalMarkdown);
    },
    [currentNodes, currentEdges],
  );

  // 重新生成逻辑已迁移到 SseLoading 组件

  // Twitter发布逻辑
  const handlePostToTwitter = useCallback(async () => {
    addToast({
      title: 'One-click tweet coming soon!',
      color: 'warning',
      timeout: 5000,
    });

    if (!rawAPIData) {
      addToast({
        title: '没有可发布的内容',
        color: 'warning',
      });
      return;
    }

    setIsPostingToTwitter(true);

    try {
      // 1. 检查Twitter授权状态
      const authStatus = await refetchTwitterAuthStatus();

      if (!authStatus.data?.authorized) {
        // 2. 用户未授权，获取授权链接并打开新窗口
        const authUrlResponse = await getTwitterAuthUrl();
        window.open(authUrlResponse.authorization_url, '_blank');

        addToast({
          title: 'Twitter授权',
          description: '请在新窗口中完成Twitter授权，然后回到此页面重试发布',
          color: 'warning',
          timeout: 5000,
        });
        return;
      }

      // 3. 用户已授权，构建推文数据
      const tweets: TwitterTweetData[] = rawAPIData.nodes
        .flatMap((group: any) => group.tweets)
        .map((tweet: any, index: number) => {
          const totalTweets = rawAPIData.nodes.reduce(
            (total: number, g: any) => total + g.tweets.length,
            0,
          );
          const tweetNumber = index + 1;
          const content = tweet.content || tweet.title || '';
          const text = `${tweetNumber}/${totalTweets}\n\n${content}`;

          const tweetData: TwitterTweetData = { text };

          // 如果推文有图片，添加图片URL
          if (tweet.image_url) {
            tweetData.image_url = tweet.image_url;
          }

          return tweetData;
        });

      const postRequest: TwitterPostRequest = {
        tweets,
        delay_seconds: 1, // 推文间隔1秒
      };

      // 后端暂时不用，发请求用于后端打 log
      postToTwitterMutation.mutateAsync(postRequest);

      // 4. 发布到Twitter
      // const response = await postToTwitterMutation.mutateAsync(postRequest);

      // addToast({
      //   title: '发布成功！',
      //   description: `成功发布 ${response.successful_tweets}/${response.total_tweets} 条推文`,
      //   color: 'success',
      // });
    } catch (error) {
      console.error('Twitter发布失败:', error);
      addToast({
        title: '发布失败',
        description: getErrorMessage(error),
        color: 'danger',
      });
    } finally {
      setIsPostingToTwitter(false);
    }
  }, [rawAPIData, postToTwitterMutation, refetchTwitterAuthStatus]);

    const onSseComplete = useCallback((data: any) => {
      console.log('SSE 生成完成:', data);
      setRawAPIData(data);
      const content = convertAPIDataToGeneratedContent(data);
      setGeneratedContent(content);
      setCurrentNodes(content.mindmap.nodes);
      setCurrentEdges(content.mindmap.edges);
      setIsGenerating(false);
    }, []);

  const onSseError = useCallback((error: any) => {
    console.error('SSE 生成失败:', error);
    setApiError(error);
    setIsGenerating(false);
  }, []);

  if (isGenerating || (!generatedContent && !rawAPIData && !initialData)) {
    const hasError = !isGenerating && !!apiError;

    // 如果有错误，使用原来的逻辑处理
    if (hasError) {
      return (
        <div className="flex h-screen flex-col bg-[#FAFAFA]">
          <div className="flex flex-1 items-center justify-center p-6">
            <div className="flex w-full max-w-[600px] flex-col items-center gap-6 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="size-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">生成失败</h2>
              <p className="max-w-md text-gray-600">{apiError}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setApiError(null);
                    // setHasStartedGeneration(false);
                    requestIdRef.current = null;
                    setIsGenerating(true);
                  }}
                  className="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600"
                >
                  重试
                </button>
                <button
                  onClick={onBack}
                  className="rounded-lg bg-gray-200 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-300"
                >
                  返回
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 使用新的 SseLoading 组件
    return (
      <SseLoading
        topic={topic}
        onComplete={onSseComplete}
        onError={onSseError}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* 顶部工具栏 */}
      <div className="shrink-0 border-b border-gray-200 bg-white px-6 py-[4px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              size="sm"
              variant="light"
              onPress={onBack}
              className="text-gray-600"
              startContent={<ChevronLeftIcon className="size-4" />}
            >
              Back
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              size="sm"
              color="primary"
              onPress={handlePostToTwitter}
              isLoading={isPostingToTwitter}
              className="bg-[#1DA1F2] text-white hover:bg-[#1991DB]"
              // startContent={!isPostingToTwitter && <Image src="/icons/twitter.svg" alt="Twitter" width={16} height={16} />}
            >
              {isPostingToTwitter ? 'Posting...' : 'Post to Twitter'}
            </Button>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧思维导图 */}
        <div className="relative w-1/2 border-r border-gray-200 bg-white">
          <ReactFlowProvider>
            <EditableContentMindmap
              nodes={currentNodes}
              edges={currentEdges}
              originalOutline={rawAPIData || undefined} // 传入原始outline数据
              onNodeSelect={handleNodeSelect}
              onNodeHover={handleNodeHover}
              onNodesChange={handleNodesChange}
              onEdgesChange={handleEdgesChange}
              onRegenerate={regenerateFromMindmap}
              onRegenerateClick={handleRegenerateClick} // 传入 API 重生成回调
              highlightedNodeId={selectedNodeId}
              hoveredTweetId={hoveredTweetId}
              isRegenerating={isRegenerating} // 传递 loading 状态
            />
          </ReactFlowProvider>
        </div>

        {/* 右侧内容区域 */}
        <div className="flex w-1/2 flex-col bg-white">
          {/* Twitter Thread内容区域 */}
          <div className="flex-1 overflow-hidden">
            {rawAPIData && (
              <EnhancedMarkdownRenderer
                content={
                  regeneratedMarkdown ||
                  (rawAPIData ? convertAPIDataToMarkdown(rawAPIData) : '')
                }
                onSectionHover={handleMarkdownHover}
                onSourceClick={handleSourceClick}
                onImageClick={handleImageClick}
                onTweetImageEdit={handleTweetImageEdit}
                onTweetContentChange={handleTweetContentChange}
                onDirectGenerate={handleDirectGenerate}
                highlightedSection={hoveredTweetId}
                hoveredTweetId={hoveredTweetId}
                selectedNodeId={selectedNodeId}
                imageData={generatedContent?.image}
                tweetData={rawAPIData}
                loadingTweetId={loadingTweetId}
                generatingImageTweetIds={generatingImageTweetIds}
                scrollToSection={scrollToSection}
              />
            )}
          </div>
        </div>
      </div>

      {/* 图片编辑模态框 */}
      {isImageEditModalOpen && editingImage && rawAPIData && (
        <ImageEditModal
          image={editingImage}
          targetTweet={editingTweetData?.content || ''}
          tweetThread={rawAPIData.nodes
            .flatMap((group: any) => group.tweets)
            .map(
              (tweet: any, index: number) =>
                `(${index + 1}) ${tweet.content || tweet.title}`,
            )
            .join(' \n')}
          onImageUpdate={handleImageUpdate}
          onClose={() => {
            setIsImageEditModalOpen(false);
            setEditingImage(null);
            setEditingTweetData(null);
            clearGeneratingImageTweetIds(); // 清除生图高亮状态
          }}
        />
      )}
    </div>
  );
}
