<template>
  <el-container>
    <el-header class="header">
      <div>
        <el-button type="primary" @click="addImage" :disabled="addData.length===5" size="small">新增</el-button>
        <el-button type="primary" @click="priImage" size="small">预览</el-button>
      </div>
    </el-header>
    <el-main>
      <ul class="list">
        <li v-for="(item,index) in addData" :key="item.id">
          <el-card style="width:340px">
            <img class="sliderimage" :src="`${baseUrl}/upload/download-image/${item.cover}`">
            <div style="padding: 14px;">
              <span class="text">{{item.title}}</span>
              <div class="bottom ">
                <time class="time">{{createTimeFmt(item.createTime) }}</time>
                <div class="btn">
                  <el-button-group>
                    <el-button type="primary" icon="el-icon-d-arrow-left" :disabled="index===0"  @click="()=>{moveLeft(index)}"></el-button>
                    <el-button type="primary" icon="el-icon-d-arrow-right" :disabled="index===addData.length-1" @click="()=>{moveRight(index)}"></el-button>
                    <el-button class='el-icon-edit-outline' type="warning"  @click="()=>{editImage(index)}"></el-button>
                    <el-button class='el-icon-delete' type="danger"  :disabled="addData.length===1" @click="()=>{closeImage(index)}"></el-button>
                  </el-button-group>
                </div>
              </div>
            </div>
          </el-card>
        </li>
      </ul>
    </el-main>
    <el-dialog  title="预览" :visible.sync="dialogVisible" width="700px" :close-on-click-modal="false" @close="closeDialog">

        <el-carousel arrow="always" height="223px">
        <el-carousel-item v-for="item in addData" :key="item">
          <img class="privImage" :src="`${baseUrl}/upload/download-image/${item.cover}`">
        </el-carousel-item>
      </el-carousel>

    </el-dialog>
    <el-dialog :title="dialogIsEdit?'编辑':'新增'" :visible.sync="editDialog" width="700px" :close-on-click-modal="false" @close="closeEdit">
      <div style="height:400px">
        <el-form :model="sliderForm" ref="form" label-width="100px" size="small" label-suffix=":">
          <el-form-item label="选择模块" prop="module">
            <el-select v-model="sliderForm.module" @change="change">
              <el-option v-for="item in $lookup.getByCode('slideshowModule').children" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div style="height:360px">
          <data-grid ref="datagrid" url="slideShow/listArticle" :checkbox="false" :postParams="postParams">
            <el-table-column label="标题" prop="title" show-overflow-tooltip></el-table-column>
            <el-table-column label="作者" prop="author" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" prop="createTime" :formatter="timeFmt" show-overflow-tooltip></el-table-column>
          </data-grid>
        </div>
      </div>
      <span slot="footer">
        <el-button size="small" @click="closeEdit">取消</el-button>
        <el-button type="primary" size="small" @click="saveImage"> 确定 </el-button>
      </span>
    </el-dialog>
  </el-container>
</template>
<script>
import * as slideshowApi from '../../../api/enrollment/homepage/slideshow'
import config from '../../../../platform-config'
import moment from 'moment'

export default {
  components: {
  },
  data () {
    return {
      dialogVisible: false,
      editDialog: false,
      dialogIsEdit: false,
      moveLeftDisabled: false,
      moveRightDisabled: false,
      slideEditId: '',
      postParams: {
        page: '',
        pageSize: '',
        module: ''
      },
      addData: [],
      sliderForm: {
        module: '',
        aritcleId: '',
        sort: ''
      },
      baseUrl: config.axios.baseURL
    }
  },
  methods: {
    closeDialog () {
      this.dialogVisible = false
    },
    closeEdit () {
      this.editDialog = false
    },
    priImage () {
      this.dialogVisible = true
    },

    // 新增
    addImage () {
      const list = this.$lookup.getByCode('slideshowModule').children
      this.postParams.module = list[0].code
      this.sliderForm.module = list[0].code
      this.editDialog = true
      this.dialogIsEdit = false
      this.$refs.datagrid.reload(true)
    },
    // 编辑
    editImage (index) {
      
      const listItem = this.$lookup.getByCode('slideshowModule').children
      this.postParams.module = listItem[0].code
      this.sliderForm.module = listItem[0].code
      this.editDialog = true
      this.dialogIsEdit = true
      this.slideEditId = this.addData[index].id
      
    },
    moveLeft (index) {
      // var curItem = this.addData[index]
      // var leftItem = this.addDate[index - 1]
      // this.addData.splice(index, 1, leftItem)
      // this.addData.splice((index - 1), 1, curItem)
      // this.addData.splice(curItem - 1, 1, ...this.addData.splice(leftItem - 1, 1, this.addData[curItem - 1]))
      Promise.all([slideshowApi.moveImage(this.addData[index].id, index - 1), slideshowApi.moveImage(this.addData[index - 1].id, index)])
        .then(() => {
          
          // var slideList = this.addData
          // var temp = slideList[index]
          // slideList[index] = slideList[index - 1]
          // slideList[index - 1] = temp
          // this.addData = slideList
          const temp = this.addData[index - 1]
          this.$set(this.addData, index - 1, this.addData[index])
          this.$set(this.addData, index, temp)
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '操作失败'
          })
        })
    },
    moveRight (index) {
      Promise.all([slideshowApi.moveImage(this.addData[index].id, index + 1), slideshowApi.moveImage(this.addData[index + 1].id, index)])

        .then(() => {
          var tmp = this.addData[index + 1]
          this.$set(this.addData, index + 1, this.addData[index])
          this.$set(this.addData, index, tmp)
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '操作失败'
          })
        })
    },
    // 删除
    closeImage (index) {
      this.$confirm('确认删除?', '提示', {
        type: 'warning'
      }).then(() => {
        
        slideshowApi
          .closeImage(this.addData[index].id)
          .then(() => {
            this.addData.splice(index, 1)
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          })
      })
    },
    change () {
      Object.assign(this.postParams, this.sliderForm)
      this.$refs.datagrid.reload(true)
    },
    // 保存
    saveImage () {
      const currentItem = this.$refs.datagrid.getSelection()
      if (currentItem == null || currentItem.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要添加的文章'
        })
        return
      }
      this.sliderForm.sort = this.addData.length
      this.sliderForm.articleId = currentItem[0].id
      
      if (currentItem[0].cover === '' || currentItem[0].cover == null) {
        this.$message({
          type: 'warning',
          message: '请选择存在缩略图的文章添加'
        })
      } else {
        
        if (this.dialogIsEdit) {
          slideshowApi
            .editImage(
              this.slideEditId,
              this.sliderForm.articleId,
              this.sliderForm.module,
              this.sliderForm.sort
            )
            .then(data => {
              this.addData = this.addData.map(d => {
                if (d.id === data.id) {
                  return data
                }
                return d
              })
              this.editDialog = false
            })
        } else {
          slideshowApi
            .saveImage(
              this.sliderForm.articleId,
              this.sliderForm.module,
              this.sliderForm.sort
            )
            .then(data => {
              
              this.addData.push(data)
              this.editDialog = false
            })
        }
      }
    },
    timeFmt (row, column, cellValue, index) {
      if (cellValue == null || cellValue === '') {
        return ''
      }
      return moment(cellValue).format('YYYY-MM-DD')
    },
    createTimeFmt (time) {
      return moment(time).format('YYYY-MM-DD')
    }
  },
  beforeMount () {
    
    slideshowApi.list().then(data => {
      
      this.addData = data
    })
  }
}
</script>
<style lang="scss" scoped>
.header {
  height: 50px;
  margin-top: 15px;
}
.sliderimage {
  width: 300px;
  height: 102px;
}
.btn {
  margin-left: 70px;
  width: 120px;
  display: flex;
}
.btn button {
  width: 30px;
  padding: 10px;
}
.bottom {
  display: flex;
}
.list {
  list-style: none;
}
ul.list li {
  display: flex;
  float: left;
  margin-right: 50px;
  margin-bottom: 50px;
}
.text {
  display: block;
  width: 250px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.privImage{
  width: 660px;
  height:223px;
}
</style>
