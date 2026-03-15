<template>
  <div class="admin-categories">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>职位分类管理</span>
          <el-button type="primary" @click="showAddDialog">添加分类</el-button>
        </div>
      </template>

      <el-empty v-if="!categoryList.length && !loading" description="暂无分类" />

      <div v-ce v-loading="loading">
        <el-table :data="categoryList" style="width: 100%">
          <el-table-column type="index" width="60" label="序号" />
          <el-table-column prop="name" label="分类名称" min-width="150" />
          <el-table-column prop="info" label="分类描述" min-width="300" show-overflow-tooltip />
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link @click="editCategory(row)">编辑</el-button>
              <el-button type="danger" link @click="deleteCategoryFn(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 分类编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑分类' : '添加分类'" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="分类名称" required>
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类描述">
          <el-input v-model="form.info" type="textarea" :rows="3" placeholder="请输入分类描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCategory">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCategoryList, createCategory, updateCategory, deleteCategory } from '@/api/admin'

const loading = ref(false)
const categoryList = ref<any[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)

const form = reactive({
  id: 0,
  name: '',
  info: ''
})

const fetchCategories = async () => {
  loading.value = true
  try {
    const data = await getCategoryList()
    categoryList.value = data
  } catch (error) {
    ElMessage.error('获取分类列表失败')
  } finally {
    loading.value = false
  }
}

const showAddDialog = () => {
  isEdit.value = false
  form.id = 0
  form.name = ''
  form.info = ''
  dialogVisible.value = true
}

const editCategory = (category: any) => {
  isEdit.value = true
  form.id = category.id
  form.name = category.name
  form.info = category.info
  dialogVisible.value = true
}

const saveCategory = async () => {
  if (!form.name) {
    ElMessage.warning('请输入分类名称')
    return
  }
  try {
    if (isEdit.value) {
      await updateCategory(form.id, { name: form.name, info: form.info })
    } else {
      await createCategory({ name: form.name, info: form.info })
    }
    ElMessage.success('保存成功')
    dialogVisible.value = false
    fetchCategories()
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

const deleteCategoryFn = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定删除该分类吗？', '提示', { type: 'warning' })
    await deleteCategory(id)
    ElMessage.success('删除成功')
    fetchCategories()
  } catch {
    // 取消删除
  }
}

onMounted(fetchCategories)
</script>

<style scoped lang="scss">
.admin-categories {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}
</style>
