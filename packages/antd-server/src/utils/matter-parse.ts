interface AntdMDMatter {
  title: string;
  category: string;
  group: string;
  /** 组件名称 */
  subtitle: string;
  /** 组件描述 */
  description: string;
  /** 可用版本 */
  tag: string;
  [key: string]: any;
}

/** 解析 markdown的 meta 信息 */
export const parseMDMatter = async (
  filePath: string
): Promise<AntdMDMatter | undefined> => {
  try {
    // 使用动态导入替代静态导入
    const toVfile = await import("to-vfile");
    const vfileMatter = await import("vfile-matter");

    const file = await toVfile.read(filePath);
    vfileMatter.matter(file);

    return file.data.matter as AntdMDMatter;
  } catch (error) {
    console.error(`处理文件 ${filePath} 失败:`, error);
    return undefined;
  }
};
