package com.recruit.util;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * TF-IDF 向量化工具
 * 用于简历-职位语义相似度计算
 * 采用字符 bigram + 词语切分的混合分词策略（无需外部依赖）
 */
public class TfIdfVectorizer {

    private static final Pattern SPLIT_PATTERN = Pattern.compile("[\\s，。！？、；：\u201c\u201d\u2018\u2019【】《》\\[\\],.!?;:\\-_/\\\\()（）]+");
    // 中文停用词
    private static final Set<String> STOP_WORDS = new HashSet<>(Arrays.asList(
        "的", "了", "和", "与", "或", "是", "在", "有", "为", "以", "及",
        "等", "对", "从", "到", "于", "被", "把", "让", "使", "按", "该",
        "可", "能", "会", "要", "都", "也", "但", "而", "则", "如", "其",
        "中", "上", "下", "内", "外", "者", "之", "并", "由", "向", "他",
        "她", "它", "我", "你", "们", "这", "那", "些", "什么", "怎么",
        "and", "or", "the", "a", "an", "in", "on", "at", "to", "for",
        "of", "with", "is", "are", "be", "was", "were", "has", "have"
    ));

    private List<String> vocabulary;
    private Map<String, Integer> wordIndex;
    private Map<String, Double> idfMap;

    /**
     * 对语料库进行 TF-IDF 向量化
     *
     * @param corpus 文档列表（index 0 通常是简历，其余是职位描述）
     * @return 每个文档的 TF-IDF 向量矩阵，行=文档，列=词汇
     */
    public double[][] fitTransform(List<String> corpus) {
        List<List<String>> tokenizedCorpus = corpus.stream()
            .map(this::tokenize)
            .collect(Collectors.toList());

        // 构建词汇表
        Set<String> vocabSet = new LinkedHashSet<>();
        tokenizedCorpus.forEach(vocabSet::addAll);
        vocabulary = new ArrayList<>(vocabSet);
        wordIndex = new HashMap<>();
        for (int i = 0; i < vocabulary.size(); i++) {
            wordIndex.put(vocabulary.get(i), i);
        }

        // 计算 IDF
        int N = corpus.size();
        idfMap = new HashMap<>();
        for (String word : vocabulary) {
            long docCount = tokenizedCorpus.stream()
                .filter(tokens -> tokens.contains(word))
                .count();
            // 使用平滑 IDF，防止除零
            idfMap.put(word, Math.log((double)(N + 1) / (docCount + 1)) + 1.0);
        }

        // 计算每个文档的 TF-IDF 向量
        double[][] matrix = new double[corpus.size()][vocabulary.size()];
        for (int docIdx = 0; docIdx < tokenizedCorpus.size(); docIdx++) {
            List<String> tokens = tokenizedCorpus.get(docIdx);
            if (tokens.isEmpty()) continue;
            Map<String, Long> termFreq = tokens.stream()
                .collect(Collectors.groupingBy(t -> t, Collectors.counting()));

            for (Map.Entry<String, Long> entry : termFreq.entrySet()) {
                String word = entry.getKey();
                if (!wordIndex.containsKey(word)) continue;
                double tf = (double) entry.getValue() / tokens.size();
                double idf = idfMap.getOrDefault(word, 1.0);
                matrix[docIdx][wordIndex.get(word)] = tf * idf;
            }
        }
        return matrix;
    }

    /**
     * 计算两个向量的余弦相似度
     */
    public static double cosineSimilarity(double[] a, double[] b) {
        double dot = 0, normA = 0, normB = 0;
        for (int i = 0; i < Math.min(a.length, b.length); i++) {
            dot += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        if (normA == 0 || normB == 0) return 0.0;
        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    /**
     * 分词：词语切分 + 中文字符 bigram
     * 不依赖外部分词库，对中文短文本效果良好
     */
    private List<String> tokenize(String text) {
        if (text == null || text.trim().isEmpty()) return Collections.emptyList();

        List<String> tokens = new ArrayList<>();
        // 按标点分割得到词段
        String[] parts = SPLIT_PATTERN.split(text.toLowerCase().trim());
        for (String part : parts) {
            if (part.isEmpty()) continue;
            boolean hasChinese = part.chars().anyMatch(c -> Character.UnicodeScript.of(c) == Character.UnicodeScript.HAN);
            if (hasChinese) {
                // 中文：直接加整词，并生成 bigram 字符对
                if (part.length() <= 6 && !STOP_WORDS.contains(part)) {
                    tokens.add(part);
                }
                // bigram
                for (int i = 0; i < part.length() - 1; i++) {
                    String bigram = part.substring(i, i + 2);
                    if (!STOP_WORDS.contains(bigram)) {
                        tokens.add(bigram);
                    }
                }
                // unigram（单个中文字，过滤停用词）
                for (char c : part.toCharArray()) {
                    String ch = String.valueOf(c);
                    if (!STOP_WORDS.contains(ch) &&
                        Character.UnicodeScript.of(c) == Character.UnicodeScript.HAN) {
                        tokens.add(ch);
                    }
                }
            } else {
                // 英文/数字：整词加入
                if (part.length() >= 2 && !STOP_WORDS.contains(part)) {
                    tokens.add(part);
                }
            }
        }
        return tokens;
    }
}
