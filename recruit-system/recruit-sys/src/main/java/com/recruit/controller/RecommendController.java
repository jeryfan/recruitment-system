package com.recruit.controller;

import com.recruit.mapper.PositionMapper;
import com.recruit.model.ExperienceDO;
import com.recruit.model.result.PositionResultDO;
import com.recruit.service.ResumeService;
import com.recruit.util.TfIdfVectorizer;
import com.recruit.vo.ResumeVO;
import io.github.talelin.core.annotation.LoginRequired;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 智能岗位推荐接口
 * 基于 TF-IDF 向量空间模型计算简历与职位的语义相似度
 */
@RestController
@RequestMapping("/recruit/recommend")
public class RecommendController {

    @Autowired
    private ResumeService resumeService;

    @Autowired
    private PositionMapper positionMapper;

    /**
     * 为指定用户推荐匹配职位
     *
     * @param userId 求职者用户ID
     * @param topN   返回推荐数量，默认10
     * @return 推荐职位列表，每项含 position 对象和 score 匹配分（0-100）
     */
    @GetMapping("/{userId}")
    @LoginRequired
    public List<Map<String, Object>> recommend(
            @PathVariable Integer userId,
            @RequestParam(defaultValue = "10") int topN) {

        // 1. 获取用户简历
        ResumeVO resume = resumeService.getByUserId(userId);
        if (resume == null) {
            return Collections.emptyList();
        }

        String resumeText = buildResumeText(resume);
        if (resumeText.trim().isEmpty()) {
            return Collections.emptyList();
        }

        // 2. 获取所有在招职位
        List<PositionResultDO> positions = positionMapper.getAllActive();
        if (positions == null || positions.isEmpty()) {
            return Collections.emptyList();
        }

        // 3. 构建 TF-IDF 语料库：index 0 = 简历，其余 = 职位
        List<String> corpus = new ArrayList<>();
        corpus.add(resumeText);
        positions.forEach(p -> corpus.add(buildPositionText(p)));

        TfIdfVectorizer vectorizer = new TfIdfVectorizer();
        double[][] matrix = vectorizer.fitTransform(corpus);
        double[] resumeVec = matrix[0];

        // 4. 计算余弦相似度并排序
        List<Map<String, Object>> results = new ArrayList<>();
        for (int i = 0; i < positions.size(); i++) {
            double similarity = TfIdfVectorizer.cosineSimilarity(resumeVec, matrix[i + 1]);
            if (similarity > 0.01) {
                int score = (int) Math.round(similarity * 100);
                // 分数最高95（避免显示100%让用户产生误解）
                score = Math.min(score, 95);
                if (score >= 5) { // 过滤极低相关性
                    Map<String, Object> item = new HashMap<>();
                    item.put("position", positions.get(i));
                    item.put("score", score);
                    results.add(item);
                }
            }
        }

        // 5. 按分数降序，返回 TOP-N
        results.sort((a, b) -> Integer.compare((int) b.get("score"), (int) a.get("score")));
        return results.subList(0, Math.min(topN, results.size()));
    }

    /**
     * 将简历关键字段拼接为文本
     */
    private String buildResumeText(ResumeVO resume) {
        StringBuilder sb = new StringBuilder();
        appendIfNotNull(sb, resume.getJobIntention());
        appendIfNotNull(sb, resume.getAbility());
        appendIfNotNull(sb, resume.getPersonalSummary());
        if (resume.getExperiences() != null) {
            for (ExperienceDO exp : resume.getExperiences()) {
                appendIfNotNull(sb, exp.getName());
                appendIfNotNull(sb, exp.getPosition());
                appendIfNotNull(sb, exp.getPerformance());
            }
        }
        return sb.toString();
    }

    /**
     * 将职位关键字段拼接为文本
     */
    private String buildPositionText(PositionResultDO p) {
        StringBuilder sb = new StringBuilder();
        appendIfNotNull(sb, p.getTitle());
        appendIfNotNull(sb, p.getDescription());
        appendIfNotNull(sb, p.getRequirement());
        appendIfNotNull(sb, p.getExperience());
        appendIfNotNull(sb, p.getEducation());
        appendIfNotNull(sb, p.getCategoryName());
        appendIfNotNull(sb, p.getCity());
        return sb.toString();
    }

    private void appendIfNotNull(StringBuilder sb, String value) {
        if (value != null && !value.trim().isEmpty()) {
            sb.append(value).append(" ");
        }
    }
}
