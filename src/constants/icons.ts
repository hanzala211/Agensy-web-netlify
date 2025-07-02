import {
  FaAddressBook,
  FaArrowLeft,
  FaBriefcaseMedical,
  FaClock,
  FaDownload,
  FaFax,
  FaPhone,
  FaPills,
  FaRegEye,
  FaRegEyeSlash,
  FaRegUser,
} from "react-icons/fa";
import {
  FiCalendar,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiSearch,
  FiUsers,
  FiPrinter,
  FiShare2,
} from "react-icons/fi";
import {
  MdClose,
  MdDelete,
  MdEdit,
  MdMailOutline,
  MdMenu,
  MdOutlineEditNote,
  MdPayment,
} from "react-icons/md";
import { RxDropdownMenu } from "react-icons/rx";
import { TbPassword } from "react-icons/tb";
import {
  UserOutlined,
  HomeOutlined,
  FileOutlined,
  CalendarOutlined,
  MessageOutlined,
  SettingOutlined,
  FileTextOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import {
  FaUserDoctor,
  FaHospital,
  FaPrescriptionBottleMedical,
} from "react-icons/fa6";
import { PiNotePencilBold } from "react-icons/pi";
import { IoMdAddCircle } from "react-icons/io";
import { IoChatbubbleOutline, IoCheckmarkOutline, IoHomeSharp, IoPersonAdd } from "react-icons/io5";
import { CiMedicalCross } from "react-icons/ci";
import { GrDocumentText } from "react-icons/gr";
import { BiDollar } from "react-icons/bi";
import { FaFolder, FaFolderOpen, FaFileAlt } from "react-icons/fa";

export const ICONS = {
  mail: MdMailOutline,
  password: TbPassword,
  user: FaRegUser,
  calendar: FiCalendar,
  users: FiUsers,
  dropDown: RxDropdownMenu,
  homeIcon: HomeOutlined,
  userIcon: UserOutlined,
  fileIcon: FileOutlined,
  calendarIcon: CalendarOutlined,
  messageIcon: MessageOutlined,
  settingsIcon: SettingOutlined,
  fileTextIcon: FileTextOutlined,
  logoutIcon: LogoutOutlined,
  menu: MdMenu,
  close: MdClose,
  search: FiSearch,
  downArrow: FiChevronDown,
  leftArrow: FiChevronLeft,
  rightArrow: FiChevronRight,

  doctor: FaUserDoctor,
  hospital: FaHospital,
  pharmacy: FaPrescriptionBottleMedical,
  edit: MdEdit,
  delete: MdDelete,
  note: MdOutlineEditNote,
  noteEdit: PiNotePencilBold,
  fullLeftArrow: FaArrowLeft,
  addCircle: IoMdAddCircle,
  addContactIcon: IoPersonAdd,
  medicationsBriefcase: FaBriefcaseMedical,
  medicine: FaPills,
  clockCircle: FaClock,
  doctorIcon: FaUserDoctor,
  plus: FiPlus,
  medicalAdd: CiMedicalCross,
  address: FaAddressBook,
  phone: FaPhone,
  fax: FaFax,
  eyeOn: FaRegEye,
  eyeOff: FaRegEyeSlash,

  home: IoHomeSharp,
  document: GrDocumentText,
  download: FaDownload,
  print: FiPrinter,
  share: FiShare2,
  dollar: BiDollar,
  check: IoCheckmarkOutline,
  subscription: MdPayment,
  chat: IoChatbubbleOutline,
  folder: FaFolder,
  folderOpen: FaFolderOpen,
  fileAlt: FaFileAlt
};
