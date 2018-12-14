<template>
  <el-container>
    <el-container>
      <el-header height="120px">
        <el-form :model="searchForm" ref="search" label-width="50px" label-suffix=":" class="search-form">
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名">
                <el-input size="small" v-model="searchForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="学号">
                <el-input size="small"  v-model="searchForm.code"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="search-button-col">
              <el-form-item>
                <el-button size="small" @click="handleSearch">查询</el-button>
                <el-button size="small" @click="handleReset">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main>
        <data-grid
          ref="datagrid"
          url="/student/list"
          auth v-bind="$attrs"
          :postParams="postParams"
          :buttons="buttons"
          :actions="actions"
          @addBtnClick="add"
          @removeBtnClick="remove"
          @importBtnBtnClick="importBtn"
          @exportBtnBtnClick="exportBtn"
          @editActionClick="edit"
          @locationActionClick="location"
          @removeActionClick="({row})=>remove({rows:[row]})"
        >
          <el-table-column label="姓名" prop="name" show-overflow-tooltip></el-table-column>
          <el-table-column label="学号" prop="code" show-overflow-tooltip></el-table-column>
          <el-table-column label="性别" prop="sex" show-overflow-tooltip :formatter="sexFmt"></el-table-column>
          <el-table-column label="所属院系" prop="deptName" show-overflow-tooltip></el-table-column>
          <el-table-column label="所属专业" prop="subjectName" show-overflow-tooltip></el-table-column>
          <el-table-column label="所属班级" prop="className" show-overflow-tooltip></el-table-column>
          <el-table-column label="学制" prop="lc" show-overflow-tooltip :formatter="lcFmt"></el-table-column>
          <el-table-column label="学生状态" prop="status" show-overflow-tooltip :formatter="stuStatusFmt"></el-table-column>
          <!--<el-table-column label="添加时间" prop="createTime" show-overflow-tooltip :formatter="createTimeFmt"></el-table-column>-->
          <!--<el-table-column label="民族" prop="nation" show-overflow-tooltip :formatter="nationFmt"></el-table-column>
          <el-table-column label="出生日期" prop="birthday" show-overflow-tooltip width="90" :formatter="createTimeFmt"></el-table-column>
          <el-table-column label="身份证号" prop="identity" show-overflow-tooltip width="130"></el-table-column>
          <el-table-column label="家庭住址" prop="address" show-overflow-tooltip width="150"></el-table-column>
          <el-table-column label="家庭电话" prop="homePhone" show-overflow-tooltip width="100"></el-table-column>
          <el-table-column label="个人电话" prop="phone" show-overflow-tooltip width="100"></el-table-column>
          <el-table-column label="个人邮箱" prop="email" show-overflow-tooltip width="130"></el-table-column>
          <el-table-column label="政治面貌" prop="politicsStatus" show-overflow-tooltip :formatter="politicsStatusFmt"></el-table-column>
          <el-table-column label="其他党派" prop="otherParty" show-overflow-tooltip></el-table-column>
          <el-table-column label="入学方式" prop="way" show-overflow-tooltip :formatter="wayFmt"></el-table-column>
          <el-table-column label="类别形式" prop="categoryType" show-overflow-tooltip :formatter="categoryTypeFmt"></el-table-column>
          <el-table-column label="学校形式" prop="type" show-overflow-tooltip :formatter="typeFmt"></el-table-column>
          <el-table-column label="招生类型" prop="eType" show-overflow-tooltip :formatter="eTypeFmt"></el-table-column>
          <el-table-column label="入学时间" prop="eTime" show-overflow-tooltip width="90" :formatter="createTimeFmt"></el-table-column>
          <el-table-column label="毕业时间" prop="gTime" show-overflow-tooltip width="90" :formatter="createTimeFmt"></el-table-column>
          <el-table-column label="毕业学校" prop="gSchool" show-overflow-tooltip width="100"></el-table-column>
          <el-table-column label="是否港澳台侨外" prop="hkm" show-overflow-tooltip :formatter="hkmFmt" width="105"></el-table-column>-->
        </data-grid>
      </el-main>
    </el-container>
    <gm-dialog :title="dialogIsEdit?'编辑':'新增'" :visible.sync="dialogVisible" v-if="dialogVisible" width="790px" :close-on-click-modal="false" @close="closeDialog">
      <div style="height:450px">
        <el-tabs v-model="tabActiveName" type="card">
          <el-tab-pane label="个人信息" name="info">
            <div class="tabcontainer" style="height:390px;overflow:auto">
              <el-form ref="formI" class="form-layout" :model="dialogForm" label-width="125px" :inline="true" :label-position="labelPosition" style="text-align:left;margin-top:20px;" label-suffix=":" :rules="rules">
                <el-form-item  label="姓名"  prop="name" class="form-item-layout">
                  <el-input v-model="dialogForm.name" size="small"></el-input>
                </el-form-item>
                <el-form-item label="学号" prop="code" class="form-item-layout">
                  <el-input v-model="dialogForm.code" size="small" :disabled="dialogIsEdit"></el-input>
                </el-form-item>
                <el-form-item label="所属院系专业" prop="deptSubjectId" >
                  <el-cascader v-model="dialogForm.deptSubjectId" @change="changeSubject" :options="subjectData" :props="{value:'code',label:'name'}" style="width:200px" size="small">
                  </el-cascader>
                </el-form-item>
                <el-form-item label="所属班级" prop="classId">
                  <el-select v-model="dialogForm.classId" @change="changeClassValue" placeholder="请选择" size="small" style="width:200px">
                    <el-option
                      v-for="item in classData"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="性别" prop="sex" class="form-item-layout">
                  <el-select v-model="dialogForm.sex" placeholder="请选择" size="small" style="width:200px">
                    <el-option v-for="item in $lookup.getByCode('sex').children" :label="item.name" :key="item.code" :value="item.code">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="民族" prop="nation" class="form-item-layout">
                  <el-select v-model="dialogForm.nation" placeholder="请选择" size="small" style="width:200px">
                    <el-option v-for="item in $lookup.getByCode('nation').children" :label="item.name" :key="item.code" :value="item.code">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item  label="身份证号"  prop="identity" class="form-item-layout">
                  <el-input v-model="dialogForm.identity" size="small"></el-input>
                </el-form-item>
                <el-form-item  label="出生日期"  prop="birthday" class="form-item-layout">
                  <el-input v-model="dialogForm.birthday" size="small" disabled></el-input>
                  <!--<el-date-picker type="date" v-model="dialogForm.birthday" disabled size="small"  style="width:200px " value-format="yyyy-MM-dd"></el-date-picker>-->
                </el-form-item>
                <el-form-item label="家庭住址" prop="address">
                  <el-input v-model="dialogForm.address" size="small"></el-input>
                </el-form-item>
                <el-form-item label="家庭电话" prop="homePhone">
                  <el-input v-model="dialogForm.homePhone" size="small"></el-input>
                </el-form-item>
                <el-form-item label="个人电话" prop="phone" class="form-item-layout">
                  <el-input v-model="dialogForm.phone" size="small"></el-input>
                </el-form-item>
                <el-form-item label="个人邮箱" prop="email" class="form-item-layout">
                  <el-input v-model="dialogForm.email" size="small"></el-input>
                </el-form-item>
                <el-form-item label="政治面貌" prop="politicsStatus" class="form-item-layout">
                  <el-select v-model="dialogForm.politicsStatus" placeholder="请选择" size="small" style="width:200px">
                    <el-option v-for="item in $lookup.getByCode('politicsStatus').children" :label="item.name" :key="item.code" :value="item.code">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="其他党派" prop="otherParty" class="form-item-layout">
                  <el-input v-model="dialogForm.otherParty" size="small"></el-input>
                </el-form-item>
                <el-form-item label="学生状态" prop="status" class="form-item-layout">
                  <el-select v-model="dialogForm.status" placeholder="请选择" size="small" style="width:200px">
                    <el-option v-for="item in $lookup.getByCode('stuStatus').children" :label="item.name" :key="item.code" :value="item.code">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="入学方式" prop="way" class="form-item-layout">
                  <el-select v-model="dialogForm.way" placeholder="请选择" size="small" style="width:200px">
                    <el-option v-for="item in $lookup.getByCode('way').children" :label="item.name" :key="item.code" :value="item.code">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="类别形式" prop="categoryType" class="form-item-layout">
                  <el-select v-model="dialogForm.categoryType" placeholder="请选择" size="small" style="width:200px">
                    <el-option v-for="item in $lookup.getByCode('categoryType').children" :label="item.name" :key="item.code" :value="item.code">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="学制" prop="lc" class="form-item-layout">
                  <el-select v-model="dialogForm.lc" placeholder="请选择" size="small" style="width:200px">
                    <el-option v-for="item in $lookup.getByCode('lc').children" :label="item.name" :key="item.code" :value="item.code">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="学习形式" prop="type" class="form-item-layout">
                  <el-select v-model="dialogForm.type" placeholder="请选择" size="small" style="width:200px">
                    <el-option v-for="item in $lookup.getByCode('type').children" :label="item.name" :key="item.code" :value="item.code">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="招生类型" prop="eType" class="form-item-layout">
                  <el-select v-model="dialogForm.eType" placeholder="请选择" size="small" style="width:200px">
                    <el-option v-for="item in $lookup.getByCode('eType').children" :label="item.name" :key="item.code" :value="item.code">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="入学时间" prop="eTime" class="form-item-layout">
                  <el-date-picker type="date" placeholder="选择日期" v-model="dialogForm.eTime" size="small"  style="width:200px " value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="毕业时间" prop="gTime" >
                  <el-date-picker type="date" placeholder="选择日期" v-model="dialogForm.gTime" size="small"  style="width:200px " value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="毕业学校" prop="gSchool" class="form-item-layout">
                  <el-input v-model="dialogForm.gSchool" size="small"></el-input>
                </el-form-item>
                <el-form-item label="是否港澳台侨外" prop="hkm" class="form-item-layout">
                  <el-select v-model="dialogForm.hkm" placeholder="请选择" size="small" style="width:200px">
                    <el-option v-for="item in $lookup.getByCode('hkm').children" :label="item.name" :key="item.code" :value="item.code">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="家庭成员" name="familyInfo">
            <div class="tabcontainer" style="height:390px;overflow:auto">
              <el-form ref="formII" v-for="(dialogFormII, index) in dialogFormIIs" :key="dialogFormII.key"  class="form-layout" :model="dialogFormIIs" label-width="125px" :inline="true" :label-position="labelPosition" style="text-align:left;margin-top:20px;" label-suffix=":">
                <el-form-item  label="姓名" :prop="index + '.name'" class="form-item-layout"
                               :rules="[
                                         { required: true, message: '请输入家庭成员姓名', trigger: 'blur' },
                                       ]"
                >
                  <el-input v-model="dialogFormII.name" size="small"></el-input>
                </el-form-item>
                <el-form-item label="关系" :prop="index + '.relation'" class="form-item-layout">
                  <el-input v-model="dialogFormII.relation" size="small"></el-input>
                </el-form-item>
                <el-form-item label="家庭住址" :prop="index + '.address'" class="form-item-layout">
                  <el-input v-model="dialogFormII.address" size="small"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" :prop="index + '.telephone'" class="form-item-layout"
                              :rules="[
                                        { required: true, message: '请输入联系电话', trigger: 'blur' }
                                      ]"
                >
                  <el-input v-model="dialogFormII.telephone" size="small"></el-input>
                </el-form-item>
                <el-form-item label="工作单位" :prop="index + '.workUnit'" class="form-item-layout">
                  <el-input v-model="dialogFormII.workUnit" size="small"></el-input>
                </el-form-item>
                <el-form-item class="form-item-layout">
                  <el-button @click.prevent="removeFamilyInfo(dialogFormII)" size="small" style="margin-left: 50px;">删除</el-button>
                </el-form-item>
              </el-form>
              <el-button @click="addFamilyInfo" type="primary" size="small" style="margin-left: 50px;">添加</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="教育经历" name="eduInfo">
            <div class="tabcontainer" style="height:390px;overflow:auto">
              <el-form ref="formIII" v-for="(dialogFormIII, index) in dialogFormIIIs" :key="dialogFormIII.key" class="form-layout" :model="dialogFormIIIs" label-width="125px" :inline="true" :label-position="labelPosition" style="text-align:left;margin-top:20px;" label-suffix=":">
                <el-form-item label="学校" :prop="index + '.school'" class="form-item-layout"
                              :rules="[{ required: true, message: '请输入学校名称', trigger: 'blur' }]"
                >
                  <el-input v-model="dialogFormIII.school" size="small"></el-input>
                </el-form-item>
                <el-form-item label="入学时间" :prop="index + '.eTime'" class="form-item-layout">
                  <el-date-picker type="date" placeholder="选择日期" v-model="dialogFormIII.eTime" size="small"  style="width:200px " value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="毕业时间" :prop="index + '.gTime'" class="form-item-layout">
                  <el-date-picker type="date" placeholder="选择日期" v-model="dialogFormIII.gTime" size="small"  style="width:200px " value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="证明人" :prop="index + '.voucher'" class="form-item-layout">
                  <el-input v-model="dialogFormIII.voucher" size="small"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" :prop="index + '.telephone'" class="form-item-layout">
                  <el-input v-model="dialogFormIII.telephone" size="small"></el-input>
                </el-form-item>
                <el-form-item class="form-item-layout">
                  <el-button @click.prevent="removeEduInfo(dialogFormIII)" size="small" style="margin-left: 50px;">删除</el-button>
                </el-form-item>
              </el-form>
              <el-button @click="addEduInfo" type="primary" size="small" style="margin-left: 50px;">添加</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer">
          <el-button @click="closeDialog" size="small">取消</el-button>
          <el-button @click="okDialog" type="primary" size="small">确认</el-button>
      </span>
    </gm-dialog>
    <el-dialog title="导入"
               :visible.sync="importDialogVisible"
               width="490px"
               :close-on-click-modal="false" v-if="importDialogVisible"
               @close="closeImportDialog">
      <div style="width: 75%;margin: 0 auto;">
        <div style="height: 70px;border-bottom: 1px solid #dcdfe6;margin-bottom: 20px">
          <div style="float: left;">
            <el-upload multiple :limit="1" :file-list="attachFileList" :http-request="attachHttpRequest" list-type="text" :on-exceed="onExceed" :before-upload="beforeUpload">
              <el-button size="small" type="primary">上传</el-button>
            </el-upload>
          </div>
          <div style="float: right;">
            <el-button @click="downloadTemplate" type="primary" plain size="small">下载模版</el-button>
          </div>
        </div>
        <div>
          <el-form ref="attchmentForm" class="form-layout" :model="attachmentForm" label-width="105px" :inline="true" :label-position="labelPosition" style="text-align:left" label-suffix=":" :rules="attchmentRules">
            <el-form-item label="sheet页名称" prop="name" >
              <el-select v-model="attachmentForm.name" placeholder="请选择" size="small" style="width:222px">
                <el-option
                  v-for="item in sheetsData"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="起始行" prop="startLine" class="form-item-layout">
              <el-input-number v-model="attachmentForm.startLine" :min="2" :max="10000" size="small" style="width:222px"></el-input-number>
            </el-form-item>
            <el-form-item  label="起始列"  prop="startClu" class="form-item-layout">
              <el-input v-model="attachmentForm.startClu" size="small" style="width:222px"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" style="margin-left:200px">
            <el-button @click="coverUpload" type="danger" size="small">覆盖</el-button>
            <el-button @click="addUpload" type="primary" size="small">追加</el-button>
          </span>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="定位签到"
               :visible.sync="locationDialogVisible"
               width="790px"
               :close-on-click-modal="false"
               @close="locationDialogVisible = false">
      <el-main>
        <div style="height: 350px;overflow: auto;">
          <table class="packageTable">
            <tr>
              <td>时间</td>
              <td>位置</td>
            </tr>
            <tr v-for="item in locationArr">
              <td>{{item.stuSignTime}}</td>
              <td>{{item.address}}</td>
            </tr>
            <tr v-if="locationArr.length == 0">
              <td colspan="2" style="color: #999;">暂无位置信息</td>
            </tr>
            <tr></tr>
          </table>
        </div>
      </el-main>
    </el-dialog>
  </el-container>

</template>
<script>
import moment from 'moment'
import OrgTree from '../../components/sysconfig/OrgTree'
import * as studentInfoApi from '../../api/smartschool/studentInfo'
export default {
  inheritAttrs: false,
  components: {
    OrgTree
  },
  data () {
    return {
      searchForm: {
        name: '',
        code: ''
      },
      buttons: [
        {id: 'add', text: '新增'},
        {id: 'remove', text: '删除'},
        {id: 'importBtn', text: '导入'},
        {id: 'exportBtn', text: '导出'}
      ],
      actions: [
        {id: 'edit', text: '编辑'},
        {id: 'location', text: '位置'},
        {id: 'remove', text: '删除'}
      ],
      // 表格查询参数
      postParams: { deptId: '-1' },
      dialogIsEdit: false,
      dialogVisible: false,
      importDialogVisible: false,
      locationDialogVisible: false,
      tabActiveName: 'info',
      dialogForm: {
        id: '',
        name: '',
        code: '',
        deptSubjectId: '',
        deptId: '',
        subjectId: '',
        classId: '',
        sex: '',
        nation: '',
        birthday: '',
        identity: '',
        address: '',
        homePhone: '',
        phone: '',
        email: '',
        politicsStatus: '',
        otherParty: '',
        status: '',
        way: '',
        categoryType: '',
        lc: '',
        type: '',
        eType: '',
        eTime: '',
        gTime: '',
        gSchool: '',
        hkm: ''
      },
      dialogFormIIs: [{
        id: '',
        name: '',
        relation: '',
        address: '',
        telephone: '',
        workUnit: ''
      }],
      dialogFormIIIs: [{
        id: '',
        school: '',
        eTime: '',
        gTime: '',
        voucher: '',
        telephone: ''
      }],
      subjectData: [],
      classData: [],
      className: '',
      attachmentForm: {
        uuid: '',
        merge: '',
        name: '',
        addOrCover: '',
        startLine: '',
        startClu: ''
      },
      sheetsData: [],
      attachFileList: [],
      locationArr: [],
      rules: {
        name: [
          { required: true, message: '请输入学生姓名', trigger: 'blur' },
          { min: 2, message: '长度不能小于2个字符', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (
                /^[A-Za-z\u4e00-\u9fa5]+$/.test(value)
              ) {
                callback()
              } else {
                callback(new Error('学生姓名不能包含数字及特殊字符'))
              }
            },
            trigger: 'blur'
          }
        ],
        code: [
          { required: true, message: '请输入学号', trigger: 'blur' },
          { min: 2, message: '学号长度不能小于2个字符', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (/^[\d]+$/.test(value)) {
                callback()
              } else {
                callback(new Error('学号只能为数字'))
              }
            },
            trigger: 'blur'
          }
        ],
        deptSubjectId: [{
          required: true, message: '请输入所属院系专业', trigger: 'change'
        }],
        classId: [{
          required: true, message: '请输入所属班级', trigger: 'change'
        }],
        sex: [{
          required: true, message: '请输入性别', trigger: 'change'
        }],
        nation: [{
          required: true, message: '请输入民族', trigger: 'change'
        }],
        identity: [
          { required: true, message: '请输入身份证号', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (value === null || value === '') {
                return callback()
              }
              if (/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/.test(value)) {
                callback(
                  (() => {
                    if (value.length === 18) {
                      this.dialogForm.birthday = value.substr(6, 4) + '-' + value.substr(10, 2) + '-' + value.substr(12, 2)
                    } else if (value.length === 15) {
                      this.dialogForm.birthday = '19' + value.substr(6, 2) + '-' + value.substr(8, 2) + '-' + value.substr(10, 2)
                    }
                  })()
                )
              } else {
                callback(new Error('请输入正确的身份证号'))
              }
            },
            trigger: 'blur'
          }
        ],
        phone: [
          { required: true, message: '请输入个人电话', trigger: 'change' },
          {
            validator (rule, value, callback) {
              if (value === null || value === '') {
                return callback()
              }
              if (/^1[34578]{1}\d{9}$/.test(value)) {
                callback()
              } else {
                callback(new Error('请输入正确的电话号码'))
              }
            },
            trigger: 'blur'
          }
        ],
        politicsStatus: [{
          required: true, message: '请输入政治面貌', trigger: 'change'
        }],
        status: [{
          required: true, message: '请输入学生状态', trigger: 'change'
        }],
        way: [{
          required: true, message: '请输入入学方式', trigger: 'change'
        }],
        categoryType: [{
          required: true, message: '请输入类别形式', trigger: 'change'
        }],
        lc: [{
          required: true, message: '请输入学制', trigger: 'change'
        }],
        type: [{
          required: true, message: '请输入学习形式', trigger: 'change'
        }],
        eType: [{
          required: true, message: '请输入招生类型', trigger: 'change'
        }],
        eTime: [
          { required: true, message: '请输入入学时间', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              let gTime = this.dialogForm.gTime
              const val = (new Date(value.replace(new RegExp('-', 'gm'), '/'))).getTime()
              if (gTime !== '') {
                gTime = (new Date(gTime.replace(new RegExp('-', 'gm'), '/'))).getTime()
                if (gTime > val) {
                  callback()
                } else {
                  callback(new Error('入学时间应小于毕业时间'))
                }
              }
            }
          }
        ],
        gTime: [
          { required: true, message: '请输入毕业时间', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              let eTime = this.dialogForm.eTime
              const val = (new Date(value.replace(new RegExp('-', 'gm'), '/'))).getTime()
              if (eTime !== '') {
                eTime = (new Date(eTime.replace(new RegExp('-', 'gm'), '/'))).getTime()
                if (eTime < val) {
                  callback()
                } else {
                  callback(new Error('毕业时间应大于入学时间'))
                }
              }
            }
          }
        ],
        email: [{
          type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'
        }]
      },
      attchmentRules: {
        name: [{ required: true, message: '请选择sheet页名称', trigger: 'change' }],
        startLine: [{ required: true, message: '请输入起始行', trigger: 'change' }],
        startClu: [
          { required: true, message: '请输入起始列', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (/^[A-Z]*$/.test(value)) {
                callback()
              } else {
                callback(new Error('起始列只能输入大写字母，如"A / AB"'))
              }
            },
            trigger: 'blur'
          }
        ]
      },

      labelPosition: 'right'
    }
  },
  computed: {},
  watch: {},
  methods: {
    createTimeFmt (row, column, cellValue, index) {
      return moment(cellValue).format('YYYY-MM-DD')
    },
    // 数据字典获取
    sexFmt (row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === '' || cellValue === null) {
        return cellValue
      }
      return this.$lookup.getNameByCode(`sex.${cellValue}`)
    },
    nationFmt (row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === '' || cellValue === null) {
        return cellValue
      }
      return this.$lookup.getNameByCode(`nation.${cellValue}`)
    },
    stuStatusFmt (row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === '' || cellValue === null) {
        return cellValue
      }
      return this.$lookup.getNameByCode(`stuStatus.${cellValue}`)
    },
    wayFmt (row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === '' || cellValue === null) {
        return cellValue
      }
      return this.$lookup.getNameByCode(`way.${cellValue}`)
    },
    lcFmt (row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === '' || cellValue === null) {
        return cellValue
      }
      return this.$lookup.getNameByCode(`lc.${cellValue}`)
    },
    politicsStatusFmt (row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === '' || cellValue === null) {
        return cellValue
      }
      return this.$lookup.getNameByCode(`politicsStatus.${cellValue}`)
    },
    typeFmt (row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === '' || cellValue === null) {
        return cellValue
      }
      return this.$lookup.getNameByCode(`type.${cellValue}`)
    },
    categoryTypeFmt (row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === '' || cellValue === null) {
        return cellValue
      }
      return this.$lookup.getNameByCode(`categoryType.${cellValue}`)
    },
    eTypeFmt (row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === '' || cellValue === null) {
        return cellValue
      }
      return this.$lookup.getNameByCode(`eType.${cellValue}`)
    },
    hkmFmt (row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === '' || cellValue === null) {
        return cellValue
      }
      return this.$lookup.getNameByCode(`hkm.${cellValue}`)
    },
    changeSubject () {
      this.dialogForm.classId = ''
      let subjectId = ''
      let subjectData = this.subjectData
      subjectData.forEach(item => {
        let majorArr = item.children
        majorArr.forEach(itemII => {
          if (itemII.code === this.dialogForm.deptSubjectId[1]) {
            subjectId = itemII.id
          }
        })
      })
      studentInfoApi
        .findAllClass(subjectId)
        .then(data => {
          this.classData = data
        })
    },
    changeClassValue (val) {
      let obj = {}
      obj = this.classData.find((item) => {
        return item.id === val
      })
      this.className = obj.name
    },
    add () {
      this.dialogVisible = true
      this.dialogIsEdit = false
    },
    edit ({ row }) {
      Object.keys(this.dialogForm).forEach(key => {
        if (key === 'deptSubjectId') {
          this.dialogForm.deptSubjectId = []
          this.dialogForm.deptSubjectId.push(row.deptId)
          this.dialogForm.deptSubjectId.push(row.subjectId)
        } else {
          this.dialogForm[key] = row[key]
        }
      })

      studentInfoApi
        .findFamilyInfo(this.dialogForm.id)
        .then(data => {
          let dataArr = data.list
          this.dialogFormIIs = []
          for (var i = 0; i < dataArr.length; i++) {
            let obj = {}
            obj.id = ''
            obj.name = ''
            obj.relation = ''
            obj.address = ''
            obj.telephone = ''
            obj.workUnit = ''
            this.dialogFormIIs.push(obj)
          }
          this.dialogFormIIs.forEach((item, index) => {
            Object.keys(item).forEach(key => {
              item[key] = dataArr[index][key]
            })
          })
        })

      studentInfoApi
        .findEduInfo(this.dialogForm.id)
        .then(data => {
          let dataArr = data.list
          this.dialogFormIIIs = []
          for (var i = 0; i < dataArr.length; i++) {
            let obj = {}
            obj.id = ''
            obj.school = ''
            obj.eTime = ''
            obj.gTime = ''
            obj.voucher = ''
            obj.telephone = ''
            this.dialogFormIIIs.push(obj)
          }
          this.dialogFormIIIs.forEach((item, index) => {
            Object.keys(item).forEach(key => {
              item[key] = dataArr[index][key]
            })
          })
        })

      this.dialogVisible = true
      this.dialogIsEdit = true
    },
    location ({ row }) {
      this.locationArr = []
      studentInfoApi
        .findLocation({'studentCode': row.code})
        .then(data => {
          this.locationDialogVisible = true
          data.list.forEach(item => {
            this.locationArr.push({
              stuSignTime: item.stuSignTime,
              address: item.address
            })
          })
        })
        .catch((error) => {
          this.$message({
            type: 'error',
            message: error.message
          })
        })
    },
    remove ({ rows }) {
      if (rows.length === 0) {
        this.$message({
          type: 'warning',
          message: '请至少选择一条数据删除'
        })
      } else if (rows.length > 0) {
        this.$confirm('确认删除？', '提示', {
          type: 'warning'
        }).then(() => {
          var ids = []
          for (var i = 0; i < rows.length; i++) {
            ids.push(rows[i].id)
          }
          studentInfoApi
            .remove(ids)
            .then(() => {
              this.$refs.datagrid.reload()
            })
            .catch((error) => {
              this.$message({
                type: 'error',
                message: error.message
              })
            })
        })
      }
    },
    closeDialog () {
      this.dialogVisible = false
      Object.keys(this.dialogForm).forEach(key => {
        this.dialogForm[key] = ''
      })
      this.dialogFormIIs = [{id: '', name: '', relation: '', address: '', telephone: '', workUnit: ''}]
      this.dialogFormIIIs = [{id: '', school: '', eTime: '', gTime: '', voucher: '', telephone: ''}]

      this.className = ''
      this.$refs.formI.clearValidate(() => {
        if (this.$refs.formI !== undefined) {
          this.$refs.formI.clearValidate()
        }
      })
      this.tabActiveName = 'info'
    },
    addFamilyInfo () {
      this.dialogFormIIs.push({
        id: '',
        name: '',
        relation: '',
        address: '',
        telephone: '',
        workUnit: ''
      })
    },
    removeFamilyInfo (item) {
      var index = this.dialogFormIIs.indexOf(item)
      if (index !== -1) {
        this.dialogFormIIs.splice(index, 1)
      }
    },
    addEduInfo () {
      this.dialogFormIIIs.push({
        id: '',
        school: '',
        eTime: '',
        gTime: '',
        voucher: '',
        telephone: ''
      })
    },
    removeEduInfo (item) {
      var index = this.dialogFormIIIs.indexOf(item)
      if (index !== -1) {
        this.dialogFormIIIs.splice(index, 1)
      }
    },
    okDialog () {
      this.$refs.formI.validate(isSuccess => {
        if (isSuccess) {
          this._saveStudent()
        }
      })
    },
    _saveStudent () {
      this.dialogForm.subjectId = this.dialogForm.deptSubjectId[1]
      this.dialogForm.deptId = this.dialogForm.deptSubjectId[0]
      let paramsData = {}
      paramsData.student = this.dialogForm
      paramsData.listFam = this.dialogFormIIs
      paramsData.listRes = this.dialogFormIIIs
      studentInfoApi.save(paramsData)
        .then(node => {
          this.closeDialog()
          this.$refs.datagrid.reload()
        })
        .catch((error) => {
          this.$message({
            type: 'error',
            message: error.message
          })
        })
    },

    handleSearch () {
      Object.assign(this.postParams, this.searchForm)
      this.$refs.datagrid.reload(true)
    },

    handleReset () {
      this.searchForm.name = ''
      this.searchForm.code = ''
      delete this.postParams.name
      delete this.postParams.code
      this.$refs.datagrid.reload(true)
    },

    // 打开导入窗口
    importBtn () {
      this.importDialogVisible = true
    },
    // 下载导入模版
    downloadTemplate () {
      studentInfoApi
        .downloadTemplate()
        .then(data => {
          let url = window.URL.createObjectURL(new Blob([data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '学生信息导入模板.xlsx')

          document.body.appendChild(link)
          link.click()
        })
    },
    // 导出学生信息
    exportBtn () {
      studentInfoApi
        .downloadStudentInfo()
        .then(data => {
          let url = window.URL.createObjectURL(new Blob([data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '学生信息.xlsx')

          document.body.appendChild(link)
          link.click()
        })
    },
    // 导入文件
    attachHttpRequest (obj) {
      return studentInfoApi.upload(obj.file).then(data => {
        this.sheetsData = data.sheetName
        this.attachmentForm.uuid = data.uuid
      })
        .catch((error) => {
          this.$message({
            type: 'error',
            message: error.message
          })
        })
    },
    onExceed () {
      this.$message({
        type: 'warning',
        message: '每次只能上传一个文件，请您删除后再上传'
      })
    },
    beforeUpload (file) {
      const isLt30M = file.size / 1024 / 1024 < 30
      if (!isLt30M) {
        this.$message({
          type: 'warning',
          message: '上传文件大小不能超过 30MB!'
        })
      }
      return isLt30M
    },
    commonUpload () {
      studentInfoApi
        .coverUpload(this.attachmentForm)
        .then(data => {
          this.closeImportDialog()
          this.$refs.datagrid.reload()
        })
        .catch((error) => {
          this.$message({
            type: 'error',
            message: error.message
          })
        })
    },
    // 追加导入
    addUpload () {
      this.attachmentForm.addOrCover = 1
      this.attachmentForm.merge = 0
      this.$refs.attchmentForm.validate(isSuccess => {
        if (isSuccess) {
          studentInfoApi
            .coverUpload(this.attachmentForm)
            .then(data => {
              if (data.flag === 2) { // 说明有重复数据
                this.$confirm('当前导入的学生学号在数据库中存在，继续导入会替换此数据，是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.attachmentForm.merge = 1
                  this.commonUpload()
                })
              } else if (data.flag === 0) {
                this.attachmentForm.merge = 0
                this.commonUpload()
              }
            })
            .catch((error) => {
              this.$message({
                type: 'error',
                message: error.message
              })
            })
        }
      })
    },
    // 覆盖导入
    coverUpload () {
      this.attachmentForm.addOrCover = 0
      this.$refs.attchmentForm.validate(isSuccess => {
        if (isSuccess) {
          this.$confirm('选择覆盖将会清空现有数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.attachmentForm.merge = 0
            this.commonUpload()
          })
        }
      })
    },
    closeImportDialog () {
      this.removeFile() // 清除中间表存储的excel文件
      this.importDialogVisible = false
      Object.keys(this.attachmentForm).forEach(key => {
        this.attachmentForm[key] = ''
      })
      this.sheetsData = ''
      this.$refs.attchmentForm.clearValidate(() => {
        if (this.$refs.attchmentForm !== undefined) {
          this.$refs.attchmentForm.clearValidate()
        }
      })
    },
    removeFile () {
      studentInfoApi
        .removeFile(this.attachmentForm.uuid)
        .then(data => {
          this.attachFileList = []
        })
    }
  },
  beforeMount () {
    studentInfoApi
      .findAllSubject()
      .then(data => {
        this.subjectData = data
      })
      .catch()
  }
}
</script>
<style lang="scss" scoped>
  .el-header {
    border-bottom: 1px solid #e4e7ed;
  }
  .packageTable{
    width: 90%;
    overflow: auto;
    border: 1px solid rgb(235,238,245);
    border-collapse: collapse;
    margin: auto;
    margin-bottom: 50px;
    td{
      height: 35px;
      border: 1px solid rgb(235,238,245);
      text-align: center;
      font-size: 12px;
    }
  }
</style>
