import { StyleSheet } from 'react-native';

const PRIMARY_COLOR = "#286660";
const ACCENT_COLOR = "#bed2d0";
const ACCENT_RED = "#e74c3c";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  backgroundImageStyle: {
    opacity: 1,
  },
  topSection: {
    height: '35%',
    position: 'relative',
  },
  aiChipContainer: {
    position: 'absolute',
    top: 60,
    left: 30,
    zIndex: 2,
  },
  aiChip: {
    width: 60,
    height: 40,
    backgroundColor: '#90EE90',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#90EE90',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  aiText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  circuitLines: {
    position: 'absolute',
    top: 20,
    left: 70,
  },
  circuitLine1: {
    width: 40,
    height: 2,
    backgroundColor: '#90EE90',
    borderRadius: 1,
    marginBottom: 8,
  },
  circuitLine2: {
    width: 30,
    height: 2,
    backgroundColor: '#90EE90',
    borderRadius: 1,
    marginBottom: 8,
  },
  circuitLine3: {
    width: 50,
    height: 2,
    backgroundColor: '#90EE90',
    borderRadius: 1,
  },
  logoContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  logo: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logoImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  stethoscope: {
    position: 'absolute',
    top: 15,
    right: 8,
  },
  bottomSection: {
    flex: 1,
    paddingTop: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  cardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 25,
    marginHorizontal: 10,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    textAlign: 'center',
    marginBottom: 8,
  },
  loginLink: {
    alignItems: 'center',
    marginBottom: 30,
  },
  loginLinkText: {
    color: ACCENT_RED,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: PRIMARY_COLOR,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#bed2d0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: PRIMARY_COLOR,
    borderWidth: 1,
    borderColor: '#bed2d0',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  halfInputContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  pickerTrigger: {
    backgroundColor: '#bed2d0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#bed2d0',
  },
  pickerText: {
    color: PRIMARY_COLOR,
    fontSize: 16,
  },
  pickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: '#bed2d0',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  pickerItem: {
    color: PRIMARY_COLOR,
  },
  pickerDoneButton: {
    backgroundColor: ACCENT_RED,
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  pickerDoneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: ACCENT_RED,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: ACCENT_RED,
    borderColor: ACCENT_RED,
  },
  checkboxLabel: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  signupButton: {
    backgroundColor: ACCENT_RED,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    shadowColor: ACCENT_RED,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default styles;