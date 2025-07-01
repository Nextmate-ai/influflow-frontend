'use client';

import {
  DocumentTextIcon,
  GlobeAltIcon,
  InformationCircleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import {
  Button,
  Card,
  CardBody,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@heroui/react';
import { useMemo, useState } from 'react';

interface EnhancedMarkdownRendererProps {
  content: string;
  onSectionHover?: (sectionId: string | null) => void;
  onSourceClick?: (sectionId: string) => void;
  highlightedSection?: string | null;
  sources?: string[];
  hoveredTweetId?: string | null; // 新增：从思维导图hover传递的tweetId
  imageData?: {
    url: string;
    alt: string;
    caption?: string;
  };
}

interface MarkdownSection {
  id: string;
  type: 'heading' | 'paragraph' | 'list' | 'tweet' | 'group';
  level?: number;
  content: string;
  rawContent: string;
  mappingId?: string; // 用于与思维导图节点映射
  tweetId?: string; // 用于tweet高亮
  groupIndex?: number;
  tweetIndex?: number;
  groupId?: string; // 用于group高亮
}

// 模拟信息来源数据
const getMockSources = (sectionId: string) => {
  const sourcesData: {
    [key: string]: Array<{
      type: 'report' | 'interview' | 'data' | 'survey' | 'ai';
      title: string;
      description: string;
      reliability: number;
    }>;
  } = {
    'background-analysis': [
      {
        type: 'report',
        title: '2024年行业研究报告',
        description: '权威机构发布的最新行业分析报告',
        reliability: 95,
      },
      {
        type: 'data',
        title: '市场数据统计',
        description: '来自官方统计局的市场规模数据',
        reliability: 90,
      },
    ],
    'core-viewpoints': [
      {
        type: 'interview',
        title: '专家访谈记录',
        description: '与行业专家的深度访谈内容',
        reliability: 88,
      },
      {
        type: 'ai',
        title: 'AI知识整合',
        description: '基于大量文献的AI分析结果',
        reliability: 85,
      },
    ],
    'practical-methods': [
      {
        type: 'survey',
        title: '用户调研反馈',
        description: '1000+用户的实践经验总结',
        reliability: 92,
      },
      {
        type: 'report',
        title: '最佳实践案例集',
        description: '成功企业的实施经验汇总',
        reliability: 89,
      },
    ],
    'future-trends': [
      {
        type: 'report',
        title: '技术趋势预测报告',
        description: '知名咨询公司的未来趋势分析',
        reliability: 87,
      },
      {
        type: 'ai',
        title: 'AI趋势预测',
        description: '基于大数据的AI预测模型结果',
        reliability: 83,
      },
    ],
  };

  return (
    sourcesData[sectionId] || [
      {
        type: 'ai',
        title: 'AI生成内容',
        description: '基于训练数据生成的综合性内容',
        reliability: 80,
      },
    ]
  );
};

export function EnhancedMarkdownRenderer({
  content,
  onSectionHover,
  onSourceClick,
  highlightedSection,
  sources = [],
  hoveredTweetId, // 新增参数
  imageData, // 图片数据
}: EnhancedMarkdownRendererProps) {
  const [selectedSourceSection, setSelectedSourceSection] = useState<
    string | null
  >(null);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);

  // 处理图片占位符
  const processedContent = useMemo(() => {
    if (imageData) {
      return content.replace('PLACEHOLDER_IMAGE', imageData.url);
    }
    return content;
  }, [content, imageData]);

  // 解析含有HTML标签的Markdown为结构化数据
  const sections = useMemo(() => {
    const lines = processedContent.split('\n');
    const sections: MarkdownSection[] = [];
    let currentSection: MarkdownSection | null = null;
    let sectionIndex = 0;
    let inTweetDiv = false;
    let inGroupDiv = false;
    let currentTweetId: string | null = null;
    let currentGroupIndex: number | null = null;
    let currentTweetIndex: number | null = null;
    let currentGroupId: string | null = null;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // 检查是否是group div开始标签
      const groupDivMatch = trimmedLine.match(/<div\s+data-group-id="(\d+)">/);
      if (groupDivMatch) {
        if (currentSection) {
          sections.push(currentSection);
        }
        inGroupDiv = true;
        currentGroupId = groupDivMatch[1];
        
        currentSection = {
          id: `group-section-${currentGroupId}`,
          type: 'group',
          content: '',
          rawContent: line,
          groupId: currentGroupId,
        };
        return;
      }

      // 检查是否是tweet div开始标签
      const tweetDivMatch = trimmedLine.match(/<div\s+data-tweet-id="(\d+)"\s+data-group-index="(\d+)"\s+data-tweet-index="(\d+)">/);
      if (tweetDivMatch) {
        if (currentSection) {
          sections.push(currentSection);
        }
        inTweetDiv = true;
        currentTweetId = tweetDivMatch[1];
        currentGroupIndex = parseInt(tweetDivMatch[2]);
        currentTweetIndex = parseInt(tweetDivMatch[3]);
        
        currentSection = {
          id: `tweet-section-${currentTweetId}`,
          type: 'tweet',
          content: '',
          rawContent: line,
          tweetId: currentTweetId,
          groupIndex: currentGroupIndex,
          tweetIndex: currentTweetIndex,
        };
        return;
      }

      // 检查是否是div结束标签
      if (trimmedLine === '</div>') {
        if (inTweetDiv) {
          if (currentSection) {
            sections.push(currentSection);
            currentSection = null;
          }
          inTweetDiv = false;
          currentTweetId = null;
          currentGroupIndex = null;
          currentTweetIndex = null;
          return;
        } else if (inGroupDiv) {
          if (currentSection) {
            sections.push(currentSection);
            currentSection = null;
          }
          inGroupDiv = false;
          currentGroupId = null;
          return;
        }
      }

      // 如果在div内，累积内容
      if (inTweetDiv && currentSection) {
        if (trimmedLine && !trimmedLine.startsWith('---')) {
          if (currentSection.content) {
            currentSection.content += '\n\n' + trimmedLine; // 使用\n\n保持段落分隔
          } else {
            currentSection.content = trimmedLine;
          }
          currentSection.rawContent += '\n' + line;
        }
        return;
      }

      if (inGroupDiv && currentSection) {
        if (trimmedLine && !trimmedLine.startsWith('---')) {
          if (currentSection.content) {
            currentSection.content += '\n\n' + trimmedLine;
          } else {
            currentSection.content = trimmedLine;
          }
          currentSection.rawContent += '\n' + line;
        }
        return;
      }

      // 普通markdown解析逻辑
      if (trimmedLine.startsWith('#')) {
        // 标题
        if (currentSection) {
          sections.push(currentSection);
        }

        const level = trimmedLine.match(/^#+/)?.[0].length || 1;
        const text = trimmedLine
          .replace(/^#+\s*/, '')
          .replace(/[🧵📊💡🔧🚀✨]/gu, '')
          .trim();

        currentSection = {
          id: `section-${sectionIndex++}`,
          type: 'heading',
          level,
          content: text,
          rawContent: line,
        };
      } else if (
        trimmedLine.startsWith('-') ||
        trimmedLine.startsWith('*') ||
        /^\d+\./.test(trimmedLine)
      ) {
        // 列表项
        if (!currentSection || currentSection.type !== 'list') {
          if (currentSection) {
            sections.push(currentSection);
          }
          currentSection = {
            id: `section-${sectionIndex++}`,
            type: 'list',
            content: trimmedLine,
            rawContent: line,
          };
        } else {
          currentSection.content += '\n' + trimmedLine;
          currentSection.rawContent += '\n' + line;
        }
      } else if (trimmedLine && !trimmedLine.startsWith('---')) {
        // 段落（排除分隔线）
        if (!currentSection || currentSection.type !== 'paragraph') {
          if (currentSection) {
            sections.push(currentSection);
          }
          currentSection = {
            id: `section-${sectionIndex++}`,
            type: 'paragraph',
            content: trimmedLine,
            rawContent: line,
          };
        } else {
          currentSection.content += ' ' + trimmedLine;
          currentSection.rawContent += '\n' + line;
        }
      }
    });

    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  }, [processedContent]);

  const handleSourceClick = (sectionId: string, mappingId?: string) => {
    const targetId = mappingId || sectionId;
    setSelectedSourceSection(targetId);
    setIsSourceModalOpen(true);
    onSourceClick?.(targetId);
  };

  // 渲染单个段落
  const renderSection = (section: MarkdownSection, index: number) => {
    // 检查是否应该高亮：传统高亮逻辑或基于tweetId/groupId的高亮
    const isHighlighted =
      highlightedSection === section.mappingId ||
      highlightedSection === section.id ||
      (hoveredTweetId && section.tweetId === hoveredTweetId) ||
      (hoveredTweetId && hoveredTweetId.startsWith('group-') && section.groupId === hoveredTweetId.replace('group-', ''));
    
    // Debug信息
    if (section.type === 'tweet') {
      console.log(`Tweet ${section.tweetId}: hoveredTweetId=${hoveredTweetId}, isHighlighted=${isHighlighted}`);
    }
    if (section.type === 'group') {
      console.log(`Group ${section.groupId}: hoveredTweetId=${hoveredTweetId}, isHighlighted=${isHighlighted}`);
    }
    
    const baseClasses =
      'transition-all duration-300 p-4 rounded-lg relative group cursor-pointer';
    const highlightClasses = isHighlighted
      ? 'bg-blue-50 border-2 border-blue-400 shadow-lg transform scale-[1.02]'
      : 'hover:bg-gray-50 hover:shadow-md hover:border-gray-200';

    const handleMouseEnter = () => {
      // 根据section类型传递不同的hover标识
      if (section.type === 'tweet' && section.tweetId) {
        console.log('Markdown section hover tweet:', section.tweetId);
        onSectionHover?.(section.tweetId);
      } else if (section.type === 'group' && section.groupId) {
        console.log('Markdown section hover group:', section.groupId);
        onSectionHover?.(`group-${section.groupId}`);
      } else {
        const targetId = section.mappingId || section.id;
        onSectionHover?.(targetId);
      }
    };

    const handleMouseLeave = () => onSectionHover?.(null);

    // 渲染表情符号
    const renderEmoji = (text: string) => {
      return text.replace(
        /[🧵📊💡🔧🚀✨]/gu,
        (match) => `<span class="text-lg mr-1">${match}</span>`,
      );
    };

    switch (section.type) {
      case 'heading':
        const HeadingTag = `h${Math.min(section.level || 1, 6)}` as
          | 'h1'
          | 'h2'
          | 'h3'
          | 'h4'
          | 'h5'
          | 'h6';
        const headingClasses = {
          1: 'text-2xl font-bold text-gray-900 mb-3',
          2: 'text-xl font-bold text-gray-800 mb-3',
          3: 'text-lg font-semibold text-gray-800 mb-2',
          4: 'text-base font-semibold text-gray-700 mb-2',
          5: 'text-sm font-semibold text-gray-700 mb-1',
          6: 'text-sm font-medium text-gray-600 mb-1',
        };

        return (
          <div
            key={section.id}
            className={`${baseClasses} ${highlightClasses}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <HeadingTag
              className={
                headingClasses[section.level as keyof typeof headingClasses] ||
                headingClasses[6]
              }
              dangerouslySetInnerHTML={{ __html: renderEmoji(section.content) }}
            />
            <SourceButton
              sectionId={section.id}
              mappingId={section.mappingId}
              onSourceClick={handleSourceClick}
            />
          </div>
        );

      case 'paragraph':
        // 检查是否是图片markdown语法
        const imageMatch = section.content.match(/!\[(.*?)\]\((.*?)\)/);
        if (imageMatch) {
          const [, altText, imageSrc] = imageMatch;
          return (
            <div
              key={section.id}
              className={`${baseClasses} ${highlightClasses} mb-6`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative">
                <img
                  src={imageSrc}
                  alt={altText}
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                {imageData?.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent rounded-b-lg p-4">
                    <p className="text-sm font-medium text-white drop-shadow-lg">
                      {imageData.caption}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        }

        // 处理普通段落
        const processedParagraphContent = section.content
          .replace(
            /\*\*(.*?)\*\*/g,
            '<strong class="font-semibold text-gray-900">$1</strong>',
          )
          .replace(/\*(.*?)\*/g, '<em class="italic text-gray-600">$1</em>')
          .replace(
            /#([^\s#]+)/g,
            '<span class="text-blue-600 font-medium">#$1</span>',
          );

        return (
          <div
            key={section.id}
            className={`${baseClasses} ${highlightClasses}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <p
              className="mb-3 text-sm leading-relaxed text-gray-700"
              dangerouslySetInnerHTML={{ __html: processedParagraphContent }}
            />
            <SourceButton
              sectionId={section.id}
              mappingId={section.mappingId}
              onSourceClick={handleSourceClick}
            />
          </div>
        );

      case 'list':
        const listItems = section.content
          .split('\n')
          .filter((item) => item.trim());
        const isNumberedList = /^\d+/.test(listItems[0] || '');

        return (
          <div
            key={section.id}
            className={`${baseClasses} ${highlightClasses}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {isNumberedList ? (
              <ol className="mb-3 ml-4 space-y-2">
                {listItems.map((item, idx) => (
                  <li
                    key={idx}
                    className="list-decimal text-sm leading-relaxed text-gray-700"
                  >
                    <span className="ml-2">
                      {item
                        .replace(/^\d+\.\s*/, '')
                        .replace(
                          /^\*\*(.*?)\*\*/,
                          '<strong class="font-semibold">$1</strong>',
                        )}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <ul className="mb-3 space-y-2">
                {listItems.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start text-sm leading-relaxed text-gray-700"
                  >
                    <span className="mr-3 mt-2 inline-block size-1.5 shrink-0 rounded-full bg-blue-500" />
                    <span
                      dangerouslySetInnerHTML={{
                        __html: item
                          .replace(/^[-*]\s*/, '')
                          .replace(
                            /\*\*(.*?)\*\*/g,
                            '<strong class="font-semibold text-gray-900">$1</strong>',
                          ),
                      }}
                    />
                  </li>
                ))}
              </ul>
            )}
            <SourceButton
              sectionId={section.id}
              mappingId={section.mappingId}
              onSourceClick={handleSourceClick}
            />
          </div>
        );

      case 'tweet':
        // 分离title和content - 支持H3标题格式
        const lines = section.content.split('\n\n');
        const titleLine = lines.find(line => line.startsWith('### '));
        const contentLines = lines.filter(line => line !== titleLine && line.trim() !== '');
        
        const title = titleLine ? titleLine.replace(/^### /, '') : '';
        const content = contentLines.join('\n\n');
        
        // 处理内容，保留换行和格式
        const processedTweetContent = content
          .replace(/\n/g, '<br>') // 转换换行为HTML
          .replace(
            /\*\*(.*?)\*\*/g,
            '<strong class="font-semibold text-gray-900">$1</strong>',
          )
          .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
          .replace(
            /#([^\s#]+)/g,
            '<span class="text-blue-600 font-medium">#$1</span>',
          );

        return (
          <div
            key={section.id}
            className={`${baseClasses} ${highlightClasses} mb-6 border border-gray-100`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Tweet Title */}
            {title && (
              <div className="mb-4 pb-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                  {title}
                </h3>
              </div>
            )}
            
            {/* Tweet Content */}
            <div
              className="text-sm leading-relaxed text-gray-700"
              dangerouslySetInnerHTML={{ __html: processedTweetContent }}
            />
            
            <SourceButton
              sectionId={section.id}
              mappingId={section.tweetId}
              onSourceClick={handleSourceClick}
            />
          </div>
        );

      case 'group':
        // 处理分组标题 (H2)
        const groupTitle = section.content.replace(/^## /, '');
        
        return (
          <div
            key={section.id}
            className={`${baseClasses} ${highlightClasses} mb-6`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {groupTitle}
            </h2>
            <SourceButton
              sectionId={section.id}
              mappingId={section.groupId}
              onSourceClick={handleSourceClick}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'report':
        return <DocumentTextIcon className="size-4" />;
      case 'interview':
        return <UserIcon className="size-4" />;
      case 'data':
        return <GlobeAltIcon className="size-4" />;
      case 'survey':
        return <UserIcon className="size-4" />;
      case 'ai':
        return (
          <div className="size-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
        );
      default:
        return <InformationCircleIcon className="size-4" />;
    }
  };

  const getSourceColor = (type: string) => {
    switch (type) {
      case 'report':
        return 'primary';
      case 'interview':
        return 'success';
      case 'data':
        return 'warning';
      case 'survey':
        return 'secondary';
      case 'ai':
        return 'default';
      default:
        return 'default';
    }
  };

  const getSourceBgColor = (type: string) => {
    switch (type) {
      case 'report':
        return 'bg-blue-100';
      case 'interview':
        return 'bg-green-100';
      case 'data':
        return 'bg-orange-100';
      case 'survey':
        return 'bg-gray-100';
      case 'ai':
        return 'bg-gray-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <>
      <div className="h-full overflow-y-auto bg-white">
        <div className="max-w-none p-6">
          <div className="space-y-2">
            {sections.map((section, index) => renderSection(section, index))}
          </div>

          {/* 内容底部信息 */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="mb-4 flex flex-wrap gap-2">
              <Chip size="sm" variant="flat" color="primary">
                AI生成内容
              </Chip>
              <Chip size="sm" variant="flat" color="success">
                多来源验证
              </Chip>
              <Chip size="sm" variant="flat" color="warning">
                持续更新
              </Chip>
            </div>
            <p className="text-xs text-gray-500">
              本内容由AI根据多个可靠来源综合生成，包含了行业报告、专家访谈、市场数据等信息。
              点击各段落旁的信息图标可查看具体来源。
            </p>
          </div>
        </div>
      </div>

      {/* 信息来源弹窗 */}
      <Modal
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">信息来源</h3>
            <p className="text-sm text-gray-500">
              该内容段落的信息来源和可靠性分析
            </p>
          </ModalHeader>
          <ModalBody className="pb-6">
            <div className="space-y-4">
              {selectedSourceSection &&
                getMockSources(selectedSourceSection).map((source, index) => (
                  <Card key={index} className="border border-gray-200">
                    <CardBody className="p-4">
                      <div className="flex items-start space-x-3">
                        <div
                          className={`${getSourceBgColor(source.type)} rounded-lg p-2`}
                        >
                          {getSourceIcon(source.type)}
                        </div>
                        <div className="flex-1">
                          <div className="mb-2 flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900">
                              {source.title}
                            </h4>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">
                                可靠性
                              </span>
                              <div className="h-2 w-16 rounded-full bg-gray-200">
                                <div
                                  className="h-2 rounded-full bg-green-500"
                                  style={{ width: `${source.reliability}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium text-green-600">
                                {source.reliability}%
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            {source.description}
                          </p>
                          <div className="mt-2">
                            <Chip
                              size="sm"
                              variant="flat"
                              color={getSourceColor(source.type) as any}
                            >
                              {source.type === 'report' && '研究报告'}
                              {source.type === 'interview' && '专家访谈'}
                              {source.type === 'data' && '官方数据'}
                              {source.type === 'survey' && '用户调研'}
                              {source.type === 'ai' && 'AI分析'}
                            </Chip>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

// 信息来源按钮组件
function SourceButton({
  sectionId,
  mappingId,
  onSourceClick,
}: {
  sectionId: string;
  mappingId?: string;
  onSourceClick?: (sectionId: string, mappingId?: string) => void;
}) {
  return (
    <Button
      isIconOnly
      size="sm"
      variant="light"
      className="absolute right-2 top-2 opacity-0 transition-opacity hover:bg-blue-50 group-hover:opacity-100"
      onPress={() => onSourceClick?.(sectionId, mappingId)}
    >
      <InformationCircleIcon className="size-4 text-blue-600" />
    </Button>
  );
}
