import getComponentName from './getComponentName';
import isTag from './isTag';

export default function generateDisplayName(
  target
) {
  return isTag(target) ? `styled.${target}` : `Styled(${getComponentName(target)})`;
}
